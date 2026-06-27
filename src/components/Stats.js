import React, { useState, useEffect, useRef } from 'react';
import './Stats.css';

function Stats() {
  const [counts, setCounts] = useState({
    members: 0,
    families: 0,
    villages: 0,
    years: 0
  });
  
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          animateNumbers();
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateNumbers = () => {
    const duration = 2000;
    const targets = { members: 500, families: 150, villages: 25, years: 500 };
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounts({
        members: Math.floor(targets.members * progress),
        families: Math.floor(targets.families * progress),
        villages: Math.floor(targets.villages * progress),
        years: Math.floor(targets.years * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, interval);
  };

  return (
    <section className="stats" ref={statsRef}>
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-icon">👥</div>
          <div className="stat-number">{counts.members}+</div>
          <div className="stat-label">اراکین</div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">🏠</div>
          <div className="stat-number">{counts.families}+</div>
          <div className="stat-label">خاندان</div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">🏔️</div>
          <div className="stat-number">{counts.villages}+</div>
          <div className="stat-label">دیہات</div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">📅</div>
          <div className="stat-number">{counts.years}+</div>
          <div className="stat-label">سال کی روایت</div>
        </div>
      </div>
    </section>
  );
}

export default Stats;
