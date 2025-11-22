import React from "react";
import "./Resources.css";

export default function Videos() {
  return (
    <section className="resources" id="videos" aria-labelledby="videos-title">
      <div className="resources__container">
        <header className="resources__header">
          <h2 id="videos-title" className="resources__title">
            Videos
          </h2>
          <p className="resources__subtitle">Recorded content and lessons for Builders de Elite.</p>
        </header>

        <div className="resources__list" role="list">
          <div className="resources__item" role="listitem">
            <span className="resources__item-title">Introduction — Program overview</span>
            <button className="resources__action">Watch</button>
          </div>
          <div className="resources__item" role="listitem">
            <span className="resources__item-title">Structures — Best practices</span>
            <button className="resources__action">Watch</button>
          </div>
          <div className="resources__item" role="listitem">
            <span className="resources__item-title">Deploy — Strategies</span>
            <button className="resources__action">Watch</button>
          </div>
        </div>
      </div>
    </section>
  );
}