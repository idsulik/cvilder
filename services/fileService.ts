import { ResumeData } from '../types';

// Helper to download files
const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Helper to strip HTML tags for LaTeX
const stripHtml = (html: string) => {
   const tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
};

export const exportToJSON = (data: ResumeData) => {
  downloadFile(JSON.stringify(data, null, 2), 'resume.json', 'application/json');
};

export const exportToLaTeX = (data: ResumeData) => {
  // A simplified LaTeX template generator
  let tex = `
\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{classic}
\\moderncvcolor{blue}
\\usepackage[utf8]{inputenc}
\\usepackage[scale=0.75]{geometry}

\\name{${data.basics.name.split(' ')[0]}}{${data.basics.name.split(' ').slice(1).join(' ')}}
\\title{${data.basics.label}}
\\phone[mobile]{${data.basics.phone}}
\\email{${data.basics.email}}
${data.basics.url ? `\\homepage{${data.basics.url}}` : ''}

\\begin{document}
\\makecvtitle

\\section{Summary}
${stripHtml(data.basics.summary)}
`;

  // Iterate over sectionOrder to generate body
  data.sectionOrder.forEach(sectionId => {
      switch(sectionId) {
          case 'work':
              if (data.work.length > 0) {
                  tex += `\\section{Experience}\n`;
                  data.work.forEach(job => {
                    tex += `\\cventry{${job.startDate} -- ${job.endDate}}{${job.position}}{${job.name}}{${job.url || ''}}{}{
\\begin{itemize}
${job.highlights.map(h => `  \\item ${stripHtml(h)}`).join('\n')}
\\end{itemize}}
`;
                  });
              }
              break;
          
          case 'education':
              if (data.education.length > 0) {
                  tex += `\\section{Education}\n`;
                  data.education.forEach(edu => {
                    tex += `\\cventry{${edu.startDate} -- ${edu.endDate}}{${edu.studyType} in ${edu.area}}{${edu.institution}}{}{GPA: ${edu.score}}{}\n`;
                  });
              }
              break;
          
          case 'projects':
              if (data.projects.length > 0) {
                  tex += `\\section{Projects}\n`;
                  data.projects.forEach(proj => {
                    tex += `\\cventry{${proj.startDate || ''} -- ${proj.endDate}}{${proj.name}}{${proj.url || ''}}{}{}{
\\begin{itemize}
${proj.highlights.map(h => `  \\item ${stripHtml(h)}`).join('\n')}
\\end{itemize}}\n`;
                  });
              }
              break;

          case 'skills':
              if (data.skills.length > 0) {
                  tex += `\\section{Skills}\n`;
                  data.skills.forEach(skill => {
                    tex += `\\cvitem{${skill.name}}{${skill.keywords.join(', ')}}\n`;
                  });
              }
              break;

          case 'certifications':
              if (data.certifications.length > 0) {
                  tex += `\\section{Certifications}\n`;
                  data.certifications.forEach(cert => {
                    tex += `\\cvitem{${cert.date}}{${cert.name}, ${cert.issuer}}\n`;
                  });
              }
              break;

          case 'additional':
              if (data.additional.length > 0) {
                  data.additional.forEach(section => {
                      tex += `\\section{${section.title}}\n`;
                      tex += `\\begin{itemize}\n`;
                      section.items.forEach(item => {
                          tex += `\\item ${stripHtml(item)}\n`;
                      });
                      tex += `\\end{itemize}\n`;
                  });
              }
              break;
      }
  });

  tex += `\\end{document}`;

  downloadFile(tex, 'resume.tex', 'application/x-tex');
};