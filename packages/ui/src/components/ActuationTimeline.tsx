import React from 'react';
import type { CaseActivityDto } from '@consilium/contracts';

export interface ActuationTimelineProps {
  actuations: CaseActivityDto[];
}

/**
 * ActuationTimeline — Dumb Component. Historial de actuaciones procesales.
 */
export const ActuationTimeline: React.FC<ActuationTimelineProps> = ({ actuations }) => {
  return (
    <div
      className="detail-history-list"
      id="detail-history-list"
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      {actuations.map((act, index) => (
        <div
          key={`${act.activityDate}-${index}`}
          style={{
            background: 'var(--tsj-blue-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6
            }}
          >
            <strong style={{ color: 'var(--tsj-blue-primary)', fontSize: '0.9rem' }}>
              {act.activityType} (Fs. {act.pageRange})
            </strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 600 }}>
              <i className="fa-regular fa-clock" /> {act.activityDate.slice(0, 10)}
            </span>
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {act.summary}
          </div>
          <div
            style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6, fontWeight: 600 }}
          >
            <i className="fa-solid fa-signature" /> Firmado: {act.signedBy}
          </div>
        </div>
      ))}
      {actuations.length === 0 ? (
        <p className="ActuationTimeline-empty">Sin actuaciones registradas.</p>
      ) : null}
    </div>
  );
};