import React from "react";
import "./Resources.css";

export default function TeachingFiles() {
  return (
    <section className="resources" id="files" aria-labelledby="files-title">
      <div className="resources__container">
        <header className="resources__header">
          <h2 id="files-title" className="resources__title">
            Downloadable Files
          </h2>
          <p className="resources__subtitle">Materials and complementary resources.</p>
        </header>

        <div className="resources__list" role="list">
          <div className="resources__item" role="listitem">
            <span className="resources__item-title">Foundations Guide (PDF)</span>
            <a className="resources__link" href="/public/thumbnail-social.jpg" download>
              Download
            </a>
          </div>
          <div className="resources__item" role="listitem">
            <span className="resources__item-title">Structures Checklist (CSV)</span>
            <a className="resources__link" href="/public/favicon.png" download>
              Download
            </a>
          </div>
          <div className="resources__item" role="listitem">
            <span className="resources__item-title">Sample scripts (ZIP)</span>
            <a className="resources__link" href="/public/vite.svg" download>
              Download
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}