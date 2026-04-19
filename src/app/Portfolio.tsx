import { useState, useEffect } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  ChevronDown,
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'experience', 'projects', 'skills', 'certifications'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="#home"
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              AJ
            </a>
            <div className="hidden md:flex items-center gap-8">
              {['Home', 'About', 'Experience', 'Projects', 'Skills', 'Certifications'].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className={`text-sm transition-colors ${
                      activeSection === item.toLowerCase()
                        ? 'text-purple-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/anuroopjajoba3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/anuroop-jajoba-44870312a"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
              <div className="bg-slate-900 rounded-full px-6 py-2">
                <span className="text-sm text-purple-300">Full-Stack Developer</span>
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Anuroop Jajoba
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Master's in Information Technology | Software Developer
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Passionate about building scalable applications with modern technologies. Experienced in
            full-stack development, cloud architecture, and agile methodologies.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => scrollToSection('projects')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              View My Work
            </Button>
            <Button
              onClick={() => (window.location.href = 'mailto:anuroopjajoba28@gmail.com')}
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
            >
              <Mail className="w-4 h-4 mr-2" />
              Get In Touch
            </Button>
          </div>
          <div className="mt-16 animate-bounce">
            <ChevronDown className="w-6 h-6 mx-auto text-purple-400" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            About <span className="text-purple-400">Me</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="bg-slate-800/50 border-purple-500/20 p-8 backdrop-blur-sm">
                <GraduationCap className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Education</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-purple-300 font-semibold">
                      Master of Science in Information Technology
                    </p>
                    <p className="text-gray-400">University of New Hampshire</p>
                    <p className="text-sm text-gray-500">Jan. 2024 - Jan. 2026 | CGPA: 3.63</p>
                  </div>
                </div>
              </Card>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Core Competencies</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'Agile Development',
                    'Test-Driven Development',
                    'Problem Solving',
                    'Collaboration',
                    'Business Acumen',
                    'Cloud Architecture',
                  ].map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-gray-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-300 leading-relaxed">
                  Based in <span className="text-purple-400">Manchester, NH</span>, I'm a dedicated
                  software developer with expertise in building full-stack applications using modern
                  technologies. I excel in collaborative environments and have a proven track record
                  of delivering high-quality solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Professional <span className="text-purple-400">Experience</span>
          </h2>
          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-400 via-pink-400 to-purple-400"></div>

            <div className="space-y-12">
              <div className="relative md:ml-auto md:w-1/2 md:pl-12">
                <div className="absolute left-0 md:left-[-6px] top-6 w-3 h-3 rounded-full bg-purple-400 ring-4 ring-slate-900"></div>
                <Card className="bg-slate-800/50 border-purple-500/20 p-6 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Software Developer Intern</h3>
                      <p className="text-purple-300">University of New Hampshire | Team Alpha</p>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300">
                      Sep. 2025 - Dec. 2025
                    </Badge>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>
                        Built front-end applications using React and JavaScript following latest
                        coding practices and standards
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>
                        Developed backend services using Python Flask and Java with Spring Boot,
                        implementing RESTful APIs
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>
                        Collaborated with product owners and tech leads in Agile/SCRUM environment
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>
                        Achieved 85% code coverage following Test-Driven Development (TDD)
                        methodology
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>
                        Implemented object-oriented programming principles and design patterns in
                        distributed systems
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>
                        Utilized DevOps tools including Git/GitHub, Jenkins for CI/CD pipelines, and
                        Docker for containerization
                      </span>
                    </li>
                  </ul>
                </Card>
              </div>

              <div className="relative md:mr-auto md:w-1/2 md:pr-12">
                <div className="absolute left-0 md:right-[-6px] md:left-auto top-6 w-3 h-3 rounded-full bg-pink-400 ring-4 ring-slate-900"></div>
                <Card className="bg-slate-800/50 border-pink-500/20 p-6 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Virtual Try-On Experience</h3>
                      <p className="text-pink-300">React, TypeScript, Node.js, JavaScript</p>
                    </div>
                    <Badge className="bg-pink-500/20 text-pink-300">2025</Badge>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 mt-1">•</span>
                      <span>
                        Built responsive frontend application using React and TypeScript with
                        component-based architecture
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 mt-1">•</span>
                      <span>
                        Implemented Node.js backend with Express framework for API routing and
                        middleware processing
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 mt-1">•</span>
                      <span>
                        Applied design patterns including Singleton, Factory, and Observer patterns
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 mt-1">•</span>
                      <span>
                        Improved system reliability from 40% to 95% through systematic
                        problem-solving
                      </span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Featured <span className="text-purple-400">Projects</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* MarketPulse AI */}
            <Card className="bg-slate-800/50 border-purple-500/20 p-6 backdrop-blur-sm hover:bg-slate-800/70 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">MarketPulse AI</h3>
                <Code2 className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-gray-400 mb-4">Full-Stack MERN Application with AWS Deployment</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS'].map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="border-purple-400/50 text-purple-300"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              <ul className="space-y-2 text-gray-300 text-sm mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span>
                    Built MERN stack application with React frontend and Python backend services
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span>
                    Implemented RESTful API architecture with JSON data interchange and
                    service-oriented patterns
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span>
                    Designed relational database with PostgreSQL and optimized SQL queries
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span>Applied object-oriented programming and MVC architecture</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span>Deployed on AWS with S3, EC2, and CloudWatch monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span>Established CI/CD pipeline with GitHub Actions and Jenkins</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-400/10 w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Project
              </Button>
            </Card>

            {/* Campus Parking Predictor */}
            <Card className="bg-slate-800/50 border-pink-500/20 p-6 backdrop-blur-sm hover:bg-slate-800/70 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Campus Parking Predictor</h3>
                <Briefcase className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-gray-400 mb-4">Full-Stack Application with Machine Learning</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Flask', 'MySQL', 'React', 'Machine Learning', 'AWS'].map((tech) => (
                  <Badge key={tech} variant="outline" className="border-pink-400/50 text-pink-300">
                    {tech}
                  </Badge>
                ))}
              </div>
              <ul className="space-y-2 text-gray-300 text-sm mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">✓</span>
                  <span>Developed full-stack application using React and Flask (Python)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">✓</span>
                  <span>
                    Built relational database with MySQL including complex SQL queries and stored
                    procedures
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">✓</span>
                  <span>Implemented JWT-based authentication with role-based access control</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">✓</span>
                  <span>Created comprehensive API documentation with JSON schema definitions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">✓</span>
                  <span>Deployed on AWS using Elastic Beanstalk with CloudWatch monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">✓</span>
                  <span>
                    Developed automated testing suite with unit, interface, and end-user functional
                    tests
                  </span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="border-pink-400 text-pink-400 hover:bg-pink-400/10 w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Project
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Technical <span className="text-purple-400">Skills</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-purple-500/20 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {['Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'SQL'].map((skill) => (
                  <Badge key={skill} className="bg-purple-500/20 text-purple-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-pink-500/20 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4">Frameworks & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Spring Boot', 'Node.js', 'Express', 'Flask', 'Full-Stack (MERN)'].map(
                  (skill) => (
                    <Badge key={skill} className="bg-pink-500/20 text-pink-300">
                      {skill}
                    </Badge>
                  ),
                )}
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-indigo-500/20 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4">Database & Cloud</h3>
              <div className="flex flex-wrap gap-2">
                {['PostgreSQL', 'MySQL', 'MongoDB', 'AWS', 'S3', 'Lambda', 'EC2'].map((skill) => (
                  <Badge key={skill} className="bg-indigo-500/20 text-indigo-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-green-500/20 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4">DevOps & Tools</h3>
              <div className="flex flex-wrap gap-2">
                {['Git/GitHub', 'Bitbucket', 'Jenkins', 'CI/CD', 'Docker', 'Automated Testing'].map(
                  (skill) => (
                    <Badge key={skill} className="bg-green-500/20 text-green-300">
                      {skill}
                    </Badge>
                  ),
                )}
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-orange-500/20 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4">Development Practices</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Agile/SCRUM',
                  'TDD',
                  'OOP',
                  'Design Patterns',
                  'Distributed Systems',
                  'Code Reviews',
                ].map((skill) => (
                  <Badge key={skill} className="bg-orange-500/20 text-orange-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-cyan-500/20 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4">Additional</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'HTML5',
                  'CSS3',
                  'Responsive Design',
                  'Web Services',
                  'Microservices Architecture',
                ].map((skill) => (
                  <Badge key={skill} className="bg-cyan-500/20 text-cyan-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            <span className="text-purple-400">Certifications</span>
          </h2>
          <Card className="bg-slate-800/50 border-purple-500/20 p-8 backdrop-blur-sm">
            <div className="flex items-start gap-6">
              <Award className="w-12 h-12 text-purple-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Gemini for Data Scientists and Analysts
                </h3>
                <p className="text-purple-300 mb-2">Google Workspace with Gemini</p>
                <p className="text-gray-400 mb-4">Google Cloud | January 2026</p>
                <p className="text-gray-300">
                  Advanced certification demonstrating proficiency in leveraging Google's Gemini AI
                  for data analysis, insights generation, and working with large language models in
                  professional data science workflows.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Let's <span className="text-purple-400">Connect</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part
            of your visions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => (window.location.href = 'mailto:anuroopjajoba28@gmail.com')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Mail className="w-4 h-4 mr-2" />
              anuroopjajoba28@gmail.com
            </Button>
            <Button
              onClick={() => window.open('https://github.com/anuroopjajoba3', '_blank')}
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button
              onClick={() =>
                window.open('https://linkedin.com/in/anuroop-jajoba-44870312a', '_blank')
              }
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
          </div>
          <p className="mt-12 text-gray-400">+1-603-674-8794 | Manchester, NH</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 Anuroop Jajoba. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
