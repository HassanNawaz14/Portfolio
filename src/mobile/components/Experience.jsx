import { experience } from '../../content/experience';
import ExperienceCard from '../../components/ExperienceCard';

function ZigzagItem({ item, isLeft }) {
  return (
    <div className={`experience-zigzag-item ${isLeft ? 'left' : 'right'}`}>
      <ExperienceCard
        title={item.role}
        subtitle={item.company}
        companyName={item.company}
        year={item.duration}
        color={item.color}
        highlights={item.highlights || []}
      />
    </div>
  );
}

const Experience = () => {
  return (
    <section id="experience" className="experience-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Professional <span>Experience</span></h2>
          <p className="section-subtitle">Places I've worked and the impact I've made.</p>
        </div>

        <div className="experience-zigzag">
          {experience.map((item, i) => (
            <ZigzagItem key={item.id} item={item} isLeft={i % 2 === 0} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
