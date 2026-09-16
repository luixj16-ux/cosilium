import React from 'react';
import type { CaseActivityDto } from '@consilium/contracts';

export interface ActuationTimelineProps {
  actuations: CaseActivityDto[];
}

/**
 * ActuationTimeline — Dumb Component. Historial de actuaciones
 * procesales de un expediente (representa el historial en orden).
 */
export const ActuationTimeline: React.FC<ActuationTimelineProps> = ({ actuations }) => {
  return (
    <ol className="ActuationTimeline">
      {actuations.map((act, index) => (
        <li key={`${act.activityDate}-${index}`} className="ActuationTimeline-item">
          <time className="ActuationTimeline-date" dateTime={act.activityDate}>
            {act.activityDate}
          </time>
          <span className="ActuationTimeline-type">{act.activityType}</span>
          <p className="ActuationTimeline-summary">{act.summary}</p>
          <span className="ActuationTimeline-signedBy">{act.signedBy}</span>
          {act.pageRange ? <span className="ActuationTimeline-pages">Fojas {act.pageRange}</span> : null}
        </li>
      ))}
      {actuations.length === 0 ? (
        <li className="ActuationTimeline-empty">Sin actuaciones registradas.</li>
      ) : null}
    </ol>
  );
};