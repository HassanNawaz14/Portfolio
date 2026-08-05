import { useEffect, useState } from 'react';

const styles = `
.hc-fixed {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 9999;
  transition: top 0.4s cubic-bezier(0.23, 1, 0.32, 1), left 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.hc-card {
  max-width: fit-content;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  gap: 0.6rem;
  backdrop-filter: blur(15px);
  box-shadow: inset 0 0 14px rgba(255, 255, 255, 0.192),
    inset 0 0 4px rgba(255, 255, 255, 0.274), 0 3px 5px rgba(0, 0, 0, 0.164);
  transition: 0.5s;
}

.hc-card:hover {
  background: rgba(173, 173, 173, 0.05);
}

.hc-card ul {
  margin: 0;
  padding: 0.5rem;
  display: flex;
  list-style: none;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  flex-direction: column;
}

.hc-card ul li {
  cursor: pointer;
  position: relative;
}

.hc-card a {
  display: block;
  line-height: 0;
}

.hc-card .svg {
  transition: all 0.3s;
  padding: 0.55rem;
  height: 28px;
  width: 28px;
  border-radius: 100%;
  color: rgb(255, 174, 0);
  fill: currentColor;
  box-shadow: inset 0 0 14px rgba(255, 255, 255, 0.3),
    inset 0 0 4px rgba(255, 255, 255, 0.5), 0 5px 5px rgba(0, 0, 0, 0.164);
}

.hc-card .text {
  opacity: 0;
  border-radius: 4px;
  padding: 3px 7px;
  transition: all 0.3s;
  color: rgb(255, 174, 0);
  background-color: rgba(255, 255, 255, 0.3);
  position: absolute;
  top: 50%;
  left: calc(100% + 10px);
  transform: translate(-6px, -50%);
  white-space: nowrap;
  font-size: 0.62rem;
  font-weight: 600;
  z-index: 9999;
  box-shadow: -5px 0 1px rgba(153, 153, 153, 0.2),
    -10px 0 1px rgba(153, 153, 153, 0.2),
    inset 0 0 14px rgba(255, 255, 255, 0.3),
    inset 0 0 4px rgba(255, 255, 255, 0.5), 0 5px 5px rgba(0, 0, 0, 0.082);
}

.iso-pro {
  transition: 0.5s;
}
.iso-pro:hover a > .svg {
  transform: translate(11px, -11px);
  border-radius: 100%;
}
.iso-pro:hover .text {
  opacity: 1;
  transform: translate(6px, -50%) skew(-5deg);
}
.iso-pro:hover .svg {
  transform: translate(4px, -4px);
}

.iso-pro span {
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1877f2;
  border-color: #1877f2;
  box-shadow: inset 0 0 14px rgba(255, 255, 255, 0.3),
    inset 0 0 4px rgba(255, 255, 255, 0.5), 0 5px 5px rgba(0, 0, 0, 0.164);
  border-radius: 50%;
  transition: all 0.3s;
  height: 44px;
  width: 44px;
  pointer-events: none;
}

.iso-pro:hover span { opacity: 1; }
.iso-pro:hover span:nth-child(1) { opacity: 0.2; }
.iso-pro:hover span:nth-child(2) { opacity: 0.4; transform: translate(-50%, -50%) translate(4px, -4px); }
.iso-pro:hover span:nth-child(3) { opacity: 0.6; transform: translate(-50%, -50%) translate(8px, -8px); }

@media (max-width: 480px) {
  .hc-fixed { left: 10px; }
  .hc-card .svg { height: 24px; width: 24px; }
  .iso-pro span { height: 38px; width: 38px; }
}
`;

const ITEMS = [
  {
    name: 'LinkedIn',
    viewBox: '0 0 448 512',
    path: 'M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3z',
    link: 'https://www.linkedin.com/in/hafiz-m-hassan-322331256',
  },
  {
    name: 'GitHub',
    viewBox: '0 0 496 512',
    path: 'M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.7-15.5 1.6-15.5 0 0 24.9 2 38.6 25.8 21.9 38.1 58.6 27.5 72.9 20.9 2.3-16.1 8.5-27.1 15.6-33.3-55.7-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.5-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z',
    link: 'https://github.com/HassanNawaz14',
  },
  {
    name: 'Kaggle',
    viewBox: '0 0 320 512',
    path: 'M304.2 501.5L158.4 320.3 298.2 185c2.6-2.7 1.7-10.5-5.3-10.5h-69.2c-3.5 0-7 1.8-10.5 5.3L80.9 313.5V7.5q0-7.5-7.5-7.5H21.5Q14 0 14 7.5v497q0 7.5 7.5 7.5h51.9q7.5 0 7.5-7.5v-109l30.8-29.3 110.5 140.6c3 3.5 6.5 5.3 10.5 5.3h66.9q5.25 0 6-3z',
    link: 'https://www.kaggle.com/hassannawaz1423',
  },
  {
    name: 'Instagram',
    viewBox: '0 0 448 512',
    path: 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1 9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z',
    link: 'https://www.instagram.com/hassan.nawaz142003/',
  },
];

function ContactLinks() {
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = document.querySelector('.sector-header');
      if (!el) {
        setHeaderVisible(false);
        return;
      }
      const opacity = parseFloat(el.style.opacity);
      setHeaderVisible(!isNaN(opacity) && opacity > 0.1);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="hc-fixed" style={{ top: headerVisible ? '76px' : '16px' }}>
        <div className="hc-card">
          <ul>
            {ITEMS.map((item) => (
              <li key={item.name} className="iso-pro">
                <span />
                <span />
                <span />
                <a href={item.link} target="_blank" rel="noreferrer">
                  <svg className="svg" viewBox={item.viewBox} xmlns="http://www.w3.org/2000/svg">
                    <path d={item.path} />
                  </svg>
                </a>
                <div className="text">{item.name}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default ContactLinks;