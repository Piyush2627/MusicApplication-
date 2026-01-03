from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet

file_path = "/mnt/data/Piyush_Dahiwadkar_ATS_Resume.pdf"

styles = getSampleStyleSheet()
style = styles["Normal"]
style_heading = styles["Heading2"]

content = []

def add_heading(text)u
    content.append(Paragraph(f"<b>{text}</b>", style_heading))
    content.append(Spacer(1, 12))

def add_paragraph(text):
    content.append(Paragraph(text, style))
    content.append(Spacer(1, 10))


doc = SimpleDocTemplate(file_path, pagesize=A4)

# Build PDF content
add_heading("PIYUSH DAHIWADKAR")
add_paragraph("Phone: +91 9662722205")
add_paragraph("Email: piyushdahiwadkar89@gmail.com")
add_paragraph("GitHub: github.com/Piyush2627")
add_paragraph("Location: Pune, India")

add_heading("OBJECTIVE")
add_paragraph("Passionate developer with a strong foundation in frontend technologies and Python, focused on building clean, user-friendly applications. Seeking an opportunity to contribute to modern development projects while continuously enhancing my skills in a collaborative environment.")

add_heading("SKILLS")
add_paragraph("Languages & Frameworks: JavaScript (ES6+), HTML, CSS, React, Tailwind, MUI, Zustand, React Query, Python, Core Java, React Native")
add_paragraph("Web Development: Responsive Design, UI/UX Design, Web Accessibility")
add_paragraph("Tools & Platforms: Git, GitHub, VS Code, Figma")
add_paragraph("Other: REST APIs, State Management, Component Architecture")

add_heading("EXPERIENCE")
add_paragraph("<b>Software Developer Intern — NeuralRoots Technologies Pvt Ltd</b> (June 2024 – Present)")
add_paragraph("• Developed the official company website with a responsive and visually engaging design.<br/>"
              "• Built a responsive travel website using React Router, improving navigation and user retention by 25%.<br/>"
              "• Integrated RESTful APIs for efficient data handling.<br/>"
              "• Collaborated with designers and backend teams to deliver production-ready features.")

add_heading("PROJECTS")
add_paragraph("<b>RD Art Studio Website</b> — React, Tailwind<br/>Designed and developed a responsive website for a 3D wall painting company. Website: rdartstudio.com")
add_paragraph("<b>UI Component Library (In Progress)</b> — React, Tailwind<br/>Building a reusable UI library with pre-made components and templates.")
add_paragraph("<b>NeuralRoots Company Website</b><br/>Developed a complete frontend using React and modular UI architecture.")
add_paragraph("<b>Travel Booking Website</b> — React Router<br/>Created a responsive travel site with dynamic routing and API-based content.")

add_heading("EDUCATION")
add_paragraph("<b>BBA in Computer Application</b><br/>Pune District Education Association's Baburaoji Gholap College<br/>CGPA: 8.5 (2023 – Present)")
add_paragraph("<b>Diploma in Mechanical Engineering</b><br/>Tapi Diploma Engineering College, GTU<br/>CGPA: 7.6 (Completed May 2021)<br/>"
              "• Developed a fixture prototype for mass production; achieved 2nd place in department projects.")

doc.build(content)

file_path
