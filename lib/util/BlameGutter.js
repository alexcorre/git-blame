'use babel';

import { debounce, bindAll } from 'lodash';
import { Range, CompositeDisposable } from 'atom';
import React from 'react';
import ReactDOM from 'react-dom';

import Blamer from './Blamer';
import GitCommander from './GitCommander';
import RemoteRevision from './RemoteRevision';
import repositoryForEditorPath from './repositoryForEditorPath';
import BlameLine from '../components/BlameLine';
import GutterResize from '../components/GutterResize';

const GUTTER_ID = 'com.alexcorre.git-blame';
const GUTTER_STYLE_ID = 'com.alexcorre.git-blame.style';
const RESIZE_DEBOUNCE_MS = 5;

const GIT_CONFIG_REPO_URL = 'atom-git-blame.repositoryUrlTemplate';

export default class BlameGutter {

  constructor(editor) {
    bindAll(this, ['onResizeStart']);

    this.editor = editor;
    this.isShown = false;
    this.lineDecorations = [];
    this.disposables = new CompositeDisposable();

    // resize
    const width = atom.config.get('git-blame.columnWidth');
    this.updateGutterWidth(width);

    this.resizeStartWidth = null;
    this.resizeStartX = null;
    this.isResizing = false;
    this.eventListeners = {};
  }

  /**
   * Top level API for toggling gutter visiblity + blaming the currently
   * open file, if any.
   */
  toggleVisibility() {
    return this.setVisibility(!this.isShown);
  }

  /**
   * Set the visibility of the gutter. Bootstraps a new gutter if need be.
   *
   * @returns {Promise<boolean>}
   */
  setVisibility(visible) {
    // if we're trying to set the visiblity to the value it already has
    // just resolve and do nothing.
    if (this.isShown === visible) {
      return Promise.resolve(visible);
    }

    // grab filePath from editor
    const { editor } = this;
    const filePath = editor.isEmpty() ? null : editor.getPath();
    if (!filePath) {
      return Promise.reject(new Error('No filePath could be determined for editor.'));
    }

    if (visible) {
      // we are showing the gutter
      this.gutter().show();
      this.updateLineMarkers(filePath);
    } else {
      this.removeLineMarkers();
      this.gutter().hide();
      this.gutter().destroy();
    }

    this.isShown = visible;
    return Promise.resolve(this.isShown);
  }

  /**
   * Lazily generate a Gutter instance for the current editor, the first time
   * we need it. Any other accesses will grab the same gutter reference until
   * the Gutter is explicitly disposed.
   */
  gutter() {
    const { editor } = this;
    const gutter = editor.gutterWithName(GUTTER_ID);
    return gutter || editor.addGutter({
      name: GUTTER_ID,
      visible: false,
      priority: 100,
    });
  }

  updateLineMarkers(filePath) {
    const showOnlyLastNames = atom.config.get('git-blame.showOnlyLastNames');
    const showHash = atom.config.get('git-blame.showHash');
    const colorCommitAuthors = atom.config.get('git-blame.colorCommitAuthors');
    return repositoryForEditorPath(filePath)
      .then((repo) => {
        const blamer = new Blamer(repo);
        const gitCmd = new GitCommander(repo.getWorkingDirectory());
        const blamePromise = new Promise((resolve, reject) => {
          blamer.blame(filePath, function (err, data) {
            return err ? reject(err) : resolve([repo, data]);
          });
        });
        const gitConfigPromise = new Promise((resolve, reject) => {
          gitCmd.config(GIT_CONFIG_REPO_URL, function (err, data) {
            return err ? reject(err) : resolve(data);
          });
        });
        return Promise.all([blamePromise, gitConfigPromise]);
      })
      .then(([[repo, blameData], gitConfigData]) => {
        const remoteRevision = new RemoteRevision(repo.getOriginURL(filePath), gitConfigData);
        const hasUrlTemplate = !!remoteRevision.getTemplate();
        let lastHash = null;
        let className = null;

        blameData.forEach((lineData) => {
          const { lineNumber, hash, noCommit } = lineData;
          if (noCommit) {
            return;
          }

          // set alternating background className
          if (hash !== lastHash) {
            className = (className === 'lighter') ? 'darker' : 'lighter';
          }
          lastHash = hash;

          // generate a link to the commit
          const viewCommitUrl = hasUrlTemplate ? remoteRevision.url(lineData.hash) : '#';

          // construct props for BlameLine component
          const lineProps = {
            ...lineData,
            className,
            viewCommitUrl,
            showOnlyLastNames,
            showHash,
            colorCommitAuthors,
          };

          // adding one marker to the first line
          const lineRange = new Range([lineNumber - 1, 0], [lineNumber - 1, 0]);
          const lineMarker = this.editor.markBufferRange(lineRange);

          const node = this.generateLineElement(lineProps);
          const decoration = this.gutter().decorateMarker(lineMarker, {
            class: 'blame-line-marker',
            item: node,
          });

          this.lineDecorations.push(decoration);
        });
      });

  }

  removeLineMarkers() {
    this.disposables.dispose();
    this.disposables = new CompositeDisposable();
    this.lineDecorations.forEach((decoration) => {
      decoration.destroy();
    });
  }

  generateLineElement(lineProps) {
    const div = document.createElement('div');

    // Use React to render the BlameLine component
    ReactDOM.render(
      <GutterResize onResizeStart={this.onResizeStart}>
        <BlameLine {...lineProps} />
      </GutterResize>,
      div
    );

    const tip = atom.tooltips.add(div, {
      title: lineProps.summary,
      placement: 'right',
    });
    this.disposables.add(tip);

    return div;
  }

  onResizeStart(e) {
    this.isResizing = true;
    this.resizeStartX = e.pageX;
    this.resizeStartWidth = this.width;
    this.bindResizeEvents();
  }

  onResizeEnd() {
    this.unbindResizeEvents();
    this.isResizing = false;
    this.resizeStartX = null;
  }

  onResizeMove(e) {
    if (!this.resizeStartX) {
      return;
    }
    const delta = e.pageX - this.resizeStartX;
    this.updateGutterWidth(this.resizeStartWidth + delta);
  }

  bindResizeEvents() {
    if (!this.eventListeners.mouseup) {
      const mouseupHandler = this.onResizeEnd.bind(this);
      this.eventListeners.mouseup = mouseupHandler;
      document.addEventListener('mouseup', mouseupHandler);
    }
    if (!this.eventListeners.mousemove) {
      const mouseMoveHandler = debounce(this.onResizeMove.bind(this), RESIZE_DEBOUNCE_MS);
      this.eventListeners.mousemove = mouseMoveHandler;
      document.addEventListener('mousemove', mouseMoveHandler);
    }
  }

  unbindResizeEvents() {
    const { mousemove, mouseup } = this.eventListeners;
    document.removeEventListener('mousemove', mousemove);
    delete this.eventListeners.mousemove;
    document.removeEventListener('mouseup', mouseup);
    delete this.eventListeners.mouseup;
  }

  updateGutterWidth(newWidth) {
    this.width = newWidth;
    atom.config.set('git-blame.columnWidth', newWidth);

    let tag = document.getElementById(GUTTER_STYLE_ID);
    if (!tag) {
      tag = document.createElement('style');
      tag.id = GUTTER_STYLE_ID;
      tag.type = 'text/css';
      document.head.appendChild(tag);
    }

    const styles = `
      atom-text-editor .gutter[gutter-name="${GUTTER_ID}"] {
        width: ${newWidth}px;
      }
    `;
    tag.textContent = styles;
  }

  dispose() {
    this.gutter().destroy();
  }

}
