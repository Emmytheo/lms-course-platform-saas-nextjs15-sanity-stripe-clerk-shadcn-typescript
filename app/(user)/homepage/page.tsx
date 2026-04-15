"use client"
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Code,
  Cpu,
  Camera,
  TrendingUp,
  Wifi,
  Award,
  CheckSquare,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  ChevronRight,
  Monitor,
  Users,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const ICTCenterWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const services = [
    {
      id: 1,
      category: 'foundation',
      title: 'Computer Appreciation',
      icon: <Monitor className="w-8 h-8 text-cyan-400" />,
      description: 'Master the basics of computing, Microsoft Office Packages, Corel Draw, and Adobe Suite.',
      features: ['MS Word, Excel, PowerPoint', 'Typing Skills', 'Basic Design']
    },
    {
      id: 2,
      category: 'advanced',
      title: 'Software Engineering',
      icon: <Code className="w-8 h-8 text-purple-400" />,
      description: 'Foundational Programming, Data Structures, Algorithms, and Full-stack Web/App Development.',
      features: ['Python & Java', 'React & Node.js', 'Mobile Apps']
    },
    {
      id: 3,
      category: 'advanced',
      title: 'Robotics & Data Science',
      icon: <Cpu className="w-8 h-8 text-indigo-400" />,
      description: 'Future-proof skills in Data Analytics, Robotics, Embedded Systems, and IoT.',
      features: ['Arduino & Raspberry Pi', 'Big Data Analysis', 'Machine Learning Basics']
    },
    {
      id: 4,
      category: 'media',
      title: 'Media Proficiency',
      icon: <Camera className="w-8 h-8 text-pink-400" />,
      description: 'Professional Photography, Videography, Non-linear Editing, and Equipment Etiquette.',
      features: ['Photo Editing', 'Video Production', 'Studio Management']
    },
    {
      id: 5,
      category: 'business',
      title: 'Digital Marketing',
      icon: <TrendingUp className="w-8 h-8 text-green-400" />,
      description: 'Learn to grow brands using Social Media, SEO, and modern digital strategies.',
      features: ['Social Media Ads', 'Content Strategy', 'Brand Management']
    },
    {
      id: 6,
      category: 'exams',
      title: 'CBT Prep & Services',
      icon: <CheckSquare className="w-8 h-8 text-orange-400" />,
      description: 'Preparatory programs for JAMB, IELTS, and professional exam registration services.',
      features: ['Mock Exams', 'Registration Support', 'IELTS Tutorials']
    },
    {
      id: 7,
      category: 'advanced',
      title: 'Pro Certifications',
      icon: <Award className="w-8 h-8 text-yellow-400" />,
      description: 'Affiliate professional courses for AWS, Google, Azure, and CISCO networking.',
      features: ['Cloud Computing', 'Network Security', 'Global Certificates']
    },
    {
      id: 8,
      category: 'business',
      title: 'The Innovation Hub',
      icon: <Wifi className="w-8 h-8 text-teal-400" />,
      description: 'Digital Workspace Services, Startup Incubation, Mentorship, and Consultancy.',
      features: ['High-Speed Internet', 'Co-working Space', 'Startup Mentorship']
    }
  ];

  const filteredServices = activeTab === 'all'
    ? services
    : services.filter(s => s.category === activeTab);

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-cyan-500/30">

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/80 backdrop-blur-md border-zinc-800' : 'bg-transparent border-transparent'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg text-black font-bold">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-none tracking-tight">ICT CENTER</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Catholic Diocese of Umuahia</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#home" className="text-gray-300 hover:text-cyan-400 transition-colors">Home</a>
            <a href="#courses" className="text-gray-300 hover:text-cyan-400 transition-colors">Programs</a>
            <a href="#hub" className="text-gray-300 hover:text-cyan-400 transition-colors">The Hub</a>
            <a href="#exams" className="text-gray-300 hover:text-cyan-400 transition-colors">Exams</a>
            <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full px-6">
              Enroll Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-zinc-950 border-b border-zinc-800 absolute w-full">
            <div className="flex flex-col p-4 space-y-4 text-center">
              <a href="#home" onClick={toggleMenu} className="text-gray-400 hover:text-cyan-400">Home</a>
              <a href="#courses" onClick={toggleMenu} className="text-gray-400 hover:text-cyan-400">Programs</a>
              <a href="#hub" onClick={toggleMenu} className="text-gray-400 hover:text-cyan-400">The Hub</a>
              <a href="#exams" onClick={toggleMenu} className="text-gray-400 hover:text-cyan-400">Exams</a>
              <Button className="w-full bg-cyan-500 text-black font-bold">Enroll Now</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-black to-black opacity-80" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-8">
            <div className="inline-block px-3 py-1 bg-zinc-800/50 border border-zinc-700 text-cyan-400 rounded-full text-xs font-semibold tracking-wide uppercase mb-2">
              Directorate of Communications
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
              Empowering Minds <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Through Innovation</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
              From Computer Literacy to Robotics and Data Science. Join the premier technology hub of the Catholic Diocese of Umuahia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="h-14 px-8 text-lg font-bold bg-white text-black hover:bg-zinc-200 rounded-full">
                Explore Courses <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-zinc-700 text-white hover:bg-zinc-800 rounded-full">
                Book Workspace
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="md:w-1/2 flex justify-center relative">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              {/* Glowing Orb Effect */}
              <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full animate-pulse" />
              <div className="relative z-10 w-full h-full bg-zinc-900 border border-zinc-800 rounded-2xl rotate-3 shadow-2xl flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black opacity-80" />
                <Cpu size={120} className="text-cyan-500 relative z-20 group-hover:scale-110 transition-transform duration-500" />

                {/* Floating elements */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur border border-zinc-700 p-2 rounded-lg">
                  <Code className="w-5 h-5 text-blue-400" />
                </div>
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur border border-zinc-700 p-2 rounded-lg">
                  <Wifi className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-zinc-800 bg-zinc-950/50 relative z-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-zinc-800/50">
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">500+</h3>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Students Trained</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">24/7</h3>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Power Supply</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">10+</h3>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Global Certs</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">100%</h3>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Practical</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs & Services */}
      <section id="courses" className="py-24 container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white">Our Programs</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Comprehensive training designed for beginners, professionals, and entrepreneurs.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {['all', 'foundation', 'advanced', 'media', 'business', 'exams'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === tab
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-zinc-900 text-gray-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-cyan-500/30 transition duration-300 group hover:bg-zinc-800/80">
              <div className="mb-6 bg-black w-14 h-14 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:border-cyan-500/50 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed min-h-[60px]">
                {service.description}
              </p>
              <ul className="space-y-3 mb-8 border-t border-zinc-800 pt-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-xs text-gray-400 font-medium">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="inline-flex items-center text-cyan-400 font-bold text-sm hover:text-cyan-300 transition">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* The Hub / Co-working Section */}
      <section id="hub" className="py-24 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_left,_var(--tw-gradient-stops))] from-yellow-500/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="md:w-1/2">
            <div className="bg-zinc-900/80 backdrop-blur p-8 md:p-12 rounded-3xl border border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Users size={160} />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white border-b border-zinc-800 pb-4">Hub Amenities</h3>
              <ul className="space-y-5">
                <li className="flex items-center">
                  <CheckSquare className="text-cyan-500 mr-4 shrink-0" size={20} />
                  <span className="text-gray-300">Uninterrupted Power Supply</span>
                </li>
                <li className="flex items-center">
                  <CheckSquare className="text-cyan-500 mr-4 shrink-0" size={20} />
                  <span className="text-gray-300">High-Speed Fiber Optic Internet</span>
                </li>
                <li className="flex items-center">
                  <CheckSquare className="text-cyan-500 mr-4 shrink-0" size={20} />
                  <span className="text-gray-300">Ergonomic Workstations</span>
                </li>
                <li className="flex items-center">
                  <CheckSquare className="text-cyan-500 mr-4 shrink-0" size={20} />
                  <span className="text-gray-300">Meeting & Conference Rooms</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 text-yellow-500 font-bold tracking-wider uppercase text-sm">
              <Sparkles className="w-4 h-4" />
              Innovation Hub
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Build Your Future <span className="text-zinc-600">Here.</span>
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed">
              The ICT Center isn't just a school; it's a launchpad. We offer mentorship, consultancy, and fully equipped office space for startups, freelancers, and remote workers in Umuahia.
            </p>

            <Button className="h-14 px-8 bg-transparent border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black rounded-full text-lg font-bold">
              Book a Tour
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">

            {/* Contact Info */}
            <div className="bg-zinc-950 p-12 md:w-1/3 text-white border-r border-zinc-800 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />

              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <p className="text-gray-400 mb-10">
                Ready to start your tech journey? Visit us or send a message.
              </p>

              <div className="space-y-8">
                <div className="flex items-start">
                  <MapPin className="mt-1 mr-4 text-cyan-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide text-zinc-300 mb-1">Visit Us</h4>
                    <p className="text-sm text-gray-500">Directorate of Communications,<br />Catholic Diocese of Umuahia</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="mt-1 mr-4 text-cyan-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide text-zinc-300 mb-1">Call Us</h4>
                    <p className="text-sm text-gray-500">+234 800 123 4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="mt-1 mr-4 text-cyan-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide text-zinc-300 mb-1">Email Us</h4>
                    <p className="text-sm text-gray-500">ict@umuahiadiocese.org</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-12 md:w-2/3 bg-zinc-900/50">
              <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition text-white placeholder-zinc-700" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition text-white placeholder-zinc-700" placeholder="john@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">I am interested in</label>
                  <select className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition text-white">
                    <option>Computer Literacy Training</option>
                    <option>Advanced Programming / Data Science</option>
                    <option>Media & Photography</option>
                    <option>Workspace / Hub Services</option>
                    <option>Exam Registration (JAMB/IELTS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition text-white placeholder-zinc-700" placeholder="Tell us about your goals..."></textarea>
                </div>

                <Button type="button" size="lg" className="w-full h-14 bg-white text-black font-bold hover:bg-gray-200 rounded-lg text-base">
                  Submit Application
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-500 py-12 border-t border-zinc-900 text-sm">
        <div className="container mx-auto px-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black">
                  <BookOpen size={16} />
                </div>
                <span className="font-bold text-white text-lg tracking-tight">ICT CENTER</span>
              </div>
              <p className="text-xs">Directorate of Communications, Catholic Diocese of Umuahia</p>
            </div>
            <div className="flex space-x-8 font-medium">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Student Portal</a>
            </div>
          </div>
          <div className="mt-8 text-xs text-center border-t border-zinc-900 pt-8 opacity-40">
            &copy; {new Date().getFullYear()} Catholic Diocese of Umuahia. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ICTCenterWebsite;

