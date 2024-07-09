import '../../styles/terms.css';
const terms = (locale: any) => {
  locale = locale.locale;
  return (
    <div>
      <h3>{locale.title}</h3>

      {locale.sections.map((section: any, index: number) => (
        <div key={index} className="section">
          <h4 className="section-title">{section.title}</h4>
          <p className="section-content">{section.content}</p>
        </div>
      ))}
    </div>
  );
};

export default terms;