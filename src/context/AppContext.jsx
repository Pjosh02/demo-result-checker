import React, { createContext, useState, useEffect } from 'react';
import {
  initialClasses,
  initialSubjects,
  initialStudents,
  initialResults,
  initialTeachers,
  initialAuditLogs,
  defaultAvatars
} from '../mockData';

export const AppContext = createContext();

const defaultGradingScale = [
  { grade: 'A1', min: 75, max: 100, remark: 'Excellent', color: 'var(--success)' },
  { grade: 'B2', min: 70, max: 74, remark: 'Very Good', color: 'var(--success)' },
  { grade: 'B3', min: 65, max: 69, remark: 'Good', color: 'var(--success)' },
  { grade: 'C4', min: 60, max: 64, remark: 'Credit', color: 'var(--success)' },
  { grade: 'C5', min: 55, max: 59, remark: 'Credit', color: 'var(--success)' },
  { grade: 'C6', min: 50, max: 54, remark: 'Credit', color: 'var(--success)' },
  { grade: 'D7', min: 45, max: 49, remark: 'Pass', color: 'var(--warning)' },
  { grade: 'E8', min: 40, max: 44, remark: 'Pass', color: 'var(--warning)' },
  { grade: 'F9', min: 0, max: 39, remark: 'Fail', color: 'var(--danger)' }
];

export const AppProvider = ({ children }) => {
  // Clear stale localStorage data from older Manna Academy schema/credentials
  const CURRENT_DB_VERSION = 'v2_higgsfield';
  const savedVersion = localStorage.getItem('mc_db_version');
  if (savedVersion !== CURRENT_DB_VERSION) {
    const keysToRemove = [
      'mc_classes', 'mc_subjects', 'mc_teachers', 'mc_students', 'mc_results',
      'mc_audit_logs', 'mc_grading_scale', 'mc_failed_attempts', 'mc_lockout_until',
      'mc_selected_teacher_id', 'mc_teacher_logged_in', 'mc_admin_password',
      'mc_admin_email', 'mc_school_name', 'mc_school_subtitle', 'mc_school_logo',
      'mc_school_motto', 'mc_school_address', 'mc_report_card_font',
      'mc_report_card_header_font', 'mc_report_card_header_font_size',
      'mc_admin_name', 'mc_admin_avatar', 'mc_current_session', 'mc_current_term',
      'mc_allow_student_reg', 'mc_maintenance_mode'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    localStorage.setItem('mc_db_version', CURRENT_DB_VERSION);
  }

  // Load from local storage or fallback to mock seed data
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('mc_classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('mc_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('mc_teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('mc_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem('mc_results');
    return saved ? JSON.parse(saved) : initialResults;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('mc_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [gradingScale, setGradingScale] = useState(() => {
    const saved = localStorage.getItem('mc_grading_scale');
    return saved ? JSON.parse(saved) : defaultGradingScale;
  });

  // Security Lockout State
  const [failedAttempts, setFailedAttempts] = useState(() => {
    const saved = localStorage.getItem('mc_failed_attempts');
    return saved ? JSON.parse(saved) : 0;
  });
  
  const [lockoutUntil, setLockoutUntil] = useState(() => {
    const saved = localStorage.getItem('mc_lockout_until');
    return saved ? Number(saved) : null;
  });

  // Portal view and session impersonation for testing
  const [currentRole, setCurrentRole] = useState('student'); // student, teacher, admin
  const [selectedTeacherId, setSelectedTeacherId] = useState(() => {
    return localStorage.getItem('mc_selected_teacher_id') || 't1';
  });
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(() => {
    return localStorage.getItem('mc_teacher_logged_in') === 'true';
  });
  const [viewingResult, setViewingResult] = useState(null); // Result sheet currently active in check lookup

  // Theme state shared across layout/navigation components
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mc_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Admin settings and authentication states
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('mc_admin_password') || 'admin123';
  });

  const [adminEmail, setAdminEmail] = useState(() => {
    const saved = localStorage.getItem('mc_admin_email');
    if (saved === 'admin@manna.edu') return 'admin@higgsfield.edu';
    return saved || 'admin@higgsfield.edu';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [schoolName, setSchoolName] = useState(() => {
    const saved = localStorage.getItem('mc_school_name');
    if (saved === 'Manna Academy') return 'Higgsfield Academy';
    return saved || 'Higgsfield Academy';
  });

  const [schoolSubtitle, setSchoolSubtitle] = useState(() => {
    return localStorage.getItem('mc_school_subtitle') || 'Standalone Academic Results Checker Portal';
  });

  const [schoolLogo, setSchoolLogo] = useState(() => {
    return localStorage.getItem('mc_school_logo') || '/logo.png';
  });

  const [schoolMotto, setSchoolMotto] = useState(() => {
    return localStorage.getItem('mc_school_motto') || 'Knowledge and Integrity';
  });

  const [schoolAddress, setSchoolAddress] = useState(() => {
    return localStorage.getItem('mc_school_address') || 'Km 12, Lagos-Ibadan Expressway, Lagos, Nigeria | Est. 2012';
  });

  const [reportCardFont, setReportCardFont] = useState(() => {
    return localStorage.getItem('mc_report_card_font') || 'inter';
  });

  const [reportCardHeaderFont, setReportCardHeaderFont] = useState(() => {
    return localStorage.getItem('mc_report_card_header_font') || 'cinzel';
  });

  const [reportCardHeaderFontSize, setReportCardHeaderFontSize] = useState(() => {
    return localStorage.getItem('mc_report_card_header_font_size') || '2rem';
  });

  const [adminName, setAdminName] = useState(() => {
    return localStorage.getItem('mc_admin_name') || 'Dr. Joseph Alao';
  });

  const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e3a8a'/><circle cx='50' cy='40' r='20' fill='%23ffffff'/><path d='M20,85 C20,65 30,55 50,55 C70,55 80,65 80,85 Z' fill='%23ffffff'/></svg>";

  const [adminAvatar, setAdminAvatar] = useState(() => {
    return localStorage.getItem('mc_admin_avatar') || defaultAvatar;
  });

  const [currentSession, setCurrentSession] = useState(() => {
    return localStorage.getItem('mc_current_session') || '2025/2026';
  });

  const [currentTerm, setCurrentTerm] = useState(() => {
    return localStorage.getItem('mc_current_term') || '3rd Term';
  });

  const [allowStudentReg, setAllowStudentReg] = useState(() => {
    const saved = localStorage.getItem('mc_allow_student_reg');
    return saved !== null ? saved === 'true' : true;
  });

  const [maintenanceMode, setMaintenanceMode] = useState(() => {
    return localStorage.getItem('mc_maintenance_mode') === 'true';
  });

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('mc_admin_password', adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    localStorage.setItem('mc_admin_email', adminEmail);
  }, [adminEmail]);

  useEffect(() => {
    localStorage.setItem('mc_school_name', schoolName);
  }, [schoolName]);

  useEffect(() => {
    localStorage.setItem('mc_school_subtitle', schoolSubtitle);
  }, [schoolSubtitle]);

  useEffect(() => {
    localStorage.setItem('mc_school_logo', schoolLogo);
  }, [schoolLogo]);

  useEffect(() => {
    localStorage.setItem('mc_school_motto', schoolMotto);
  }, [schoolMotto]);

  useEffect(() => {
    localStorage.setItem('mc_school_address', schoolAddress);
  }, [schoolAddress]);

  useEffect(() => {
    localStorage.setItem('mc_report_card_font', reportCardFont);
  }, [reportCardFont]);

  useEffect(() => {
    localStorage.setItem('mc_report_card_header_font', reportCardHeaderFont);
  }, [reportCardHeaderFont]);

  useEffect(() => {
    localStorage.setItem('mc_report_card_header_font_size', reportCardHeaderFontSize);
  }, [reportCardHeaderFontSize]);

  useEffect(() => {
    localStorage.setItem('mc_admin_name', adminName);
  }, [adminName]);

  useEffect(() => {
    localStorage.setItem('mc_admin_avatar', adminAvatar);
  }, [adminAvatar]);

  useEffect(() => {
    localStorage.setItem('mc_current_session', currentSession);
  }, [currentSession]);

  useEffect(() => {
    localStorage.setItem('mc_current_term', currentTerm);
  }, [currentTerm]);

  useEffect(() => {
    localStorage.setItem('mc_allow_student_reg', allowStudentReg.toString());
  }, [allowStudentReg]);

  useEffect(() => {
    localStorage.setItem('mc_maintenance_mode', maintenanceMode.toString());
  }, [maintenanceMode]);

  // Auth Helpers
  const loginAdmin = (email, password) => {
    if (email.trim().toLowerCase() === adminEmail.trim().toLowerCase() && password.trim() === adminPassword.trim()) {
      setIsAdminLoggedIn(true);
      logAction('Admin Login', 'System', 'Administrator successfully logged into dashboard.');
      return true;
    }
    logAction('Admin Login Failed', 'System', 'Failed login attempt on Admin Portal.');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    logAction('Admin Logout', 'System', 'Administrator logged out of dashboard.');
  };

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('mc_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('mc_teacher_logged_in', isTeacherLoggedIn.toString());
  }, [isTeacherLoggedIn]);

  useEffect(() => {
    localStorage.setItem('mc_selected_teacher_id', selectedTeacherId);
  }, [selectedTeacherId]);

  useEffect(() => {
    localStorage.setItem('mc_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('mc_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('mc_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('mc_results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem('mc_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('mc_grading_scale', JSON.stringify(gradingScale));
  }, [gradingScale]);

  useEffect(() => {
    localStorage.setItem('mc_failed_attempts', failedAttempts.toString());
  }, [failedAttempts]);

  useEffect(() => {
    if (lockoutUntil) {
      localStorage.setItem('mc_lockout_until', lockoutUntil.toString());
    } else {
      localStorage.removeItem('mc_lockout_until');
    }
  }, [lockoutUntil]);

  // Audit logging helper
  const logAction = (action, user, details) => {
    const newLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      action,
      user,
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Helper: Get Grade Details
  const getGradeInfo = (score) => {
    const parsed = parseFloat(score);
    if (isNaN(parsed)) return { grade: '-', remark: '-', color: 'var(--text-muted)' };
    const rule = gradingScale.find(r => parsed >= r.min && parsed <= r.max);
    return rule || { grade: 'F9', remark: 'Fail', color: 'var(--danger)' };
  };

  // Structured Roll Number generator (random unique integer 0-5000)
  const generateRollNo = () => {
    let roll = 0;
    let exists = true;
    let attempts = 0;
    while (exists && attempts < 10000) {
      roll = Math.floor(Math.random() * 5001); // 0 to 5000
      exists = students.some(s => s.rollNo === roll);
      attempts++;
    }
    if (exists) {
      for (let i = 0; i <= 5000; i++) {
        if (!students.some(s => s.rollNo === i)) {
          return i;
        }
      }
      throw new Error("No available roll numbers in range 0-5000.");
    }
    return roll;
  };

  // Position Calculator (calculated in real-time based on finalized results)
  const getClassRanking = (classId, term, session) => {
    // Filter results matching class, term, session
    const classResults = results.filter(r => r.classId === classId && r.term === term && r.session === session);
    
    // Calculate total score and average for each result
    const scoredResults = classResults.map(res => {
      const subjectScores = Object.values(res.scores);
      const totalScore = subjectScores.reduce((acc, curr) => acc + (curr.total || 0), 0);
      const avg = subjectScores.length > 0 ? (totalScore / subjectScores.length) : 0;
      return {
        resultId: res.id,
        studentId: res.studentId,
        totalScore,
        avg
      };
    });

    // Sort descending by total score
    scoredResults.sort((a, b) => b.totalScore - a.totalScore);

    // Compute rank with ties handled (e.g. 1st, 2nd, 2nd, 4th)
    let currentRank = 1;
    const rankings = {};
    
    scoredResults.forEach((item, idx) => {
      if (idx > 0 && item.totalScore < scoredResults[idx - 1].totalScore) {
        currentRank = idx + 1;
      }
      rankings[item.studentId] = {
        rank: currentRank,
        totalScore: item.totalScore,
        average: parseFloat(item.avg.toFixed(1))
      };
    });

    return rankings;
  };

  // Student CRUD Operations
  const addStudent = (studentData, actor) => {
    let rollNoVal = parseInt(studentData.rollNo);
    if (isNaN(rollNoVal) || rollNoVal < 0 || rollNoVal > 5000) {
      rollNoVal = generateRollNo();
    }
    const newStudent = {
      id: 'std_' + Date.now(),
      name: studentData.name.trim(),
      classId: studentData.classId,
      rollNo: rollNoVal,
      dob: studentData.dob,
      fatherName: studentData.fatherName.trim(),
      motherName: studentData.motherName.trim(),
      parentContact: studentData.parentContact?.trim() || '',
      photo: studentData.photo || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
      active: true
    };
    setStudents(prev => [...prev, newStudent]);
    logAction('Added Student', actor, `Registered student ${newStudent.name} (Roll No: ${newStudent.rollNo}) into class ${newStudent.classId}.`);
    return newStudent;
  };

  const updateStudent = (studentId, updatedData, actor) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...updatedData } : s));
    logAction('Updated Student', actor, `Modified student profile for ${updatedData.name || studentId}.`);
  };

  const removeStudent = (studentId, actor) => {
    const std = students.find(s => s.id === studentId);
    setStudents(prev => prev.filter(s => s.id !== studentId));
    if (std) {
      logAction('Removed Student', actor, `Deleted student profile for ${std.name} (Roll No: ${std.rollNo}).`);
    }
  };

  // Teacher Login/Logout validation
  const loginTeacher = (email, password) => {
    const found = teachers.find(
      t => t.email.trim().toLowerCase() === email.trim().toLowerCase() && 
      (t.password || 'password123').trim() === password.trim()
    );
    if (found) {
      setSelectedTeacherId(found.id);
      setIsTeacherLoggedIn(true);
      logAction('Teacher Login', found.name, `Logged in successfully to Teacher Panel.`);
      return true;
    }
    return false;
  };

  const logoutTeacher = () => {
    setIsTeacherLoggedIn(false);
    logAction('Teacher Logout', 'System', `Logged out of Teacher Panel.`);
  };

  // Teacher CRUD Operations
  const addTeacher = (teacherData, actor) => {
    const newTeacher = {
      id: 't_' + Date.now(),
      name: teacherData.name.trim(),
      email: teacherData.email.trim(),
      password: teacherData.password ? teacherData.password.trim() : 'password123',
      assignedClass: teacherData.assignedClass,
      subjects: teacherData.subjects || [],
      photo: teacherData.photo || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%234f46e5"/><circle cx="50" cy="40" r="20" fill="%23ffffff"/><path d="M20,85 C20,65 30,55 50,55 C70,55 80,65 80,85 Z" fill="%23ffffff"/></svg>'
    };
    setTeachers(prev => [...prev, newTeacher]);
    logAction('Added Class Teacher', actor, `Registered teacher ${newTeacher.name} and assigned to class ${newTeacher.assignedClass}.`);
    return newTeacher;
  };

  const updateTeacher = (teacherId, updatedData, actor) => {
    setTeachers(prev => prev.map(t => t.id === teacherId ? { ...t, ...updatedData } : t));
    logAction('Updated Class Teacher', actor, `Modified teacher profile for ${updatedData.name || teacherId}.`);
  };

  const removeTeacher = (teacherId, actor) => {
    const teacher = teachers.find(t => t.id !== teacherId);
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
    logAction('Removed Class Teacher', actor, `Removed teacher ${teacher?.name || teacherId} from assignment.`);
  };

  // Subject CRUD Operations
  const addSubject = (subjectData, actor) => {
    const id = subjectData.id.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') || 'sub_' + Date.now();
    const newSubject = {
      id,
      name: subjectData.name.trim(),
      defaultTeacher: subjectData.defaultTeacher || 'Unassigned'
    };
    setSubjects(prev => ({
      ...prev,
      [id]: newSubject
    }));
    logAction('Added Subject', actor, `Registered subject ${newSubject.name} (${newSubject.id}).`);
    return newSubject;
  };

  const updateSubject = (subjectId, updatedData, actor) => {
    setSubjects(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        ...updatedData
      }
    }));
    logAction('Updated Subject', actor, `Modified subject details for ${updatedData.name || subjectId}.`);
  };

  const removeSubject = (subjectId, actor) => {
    const subName = subjects[subjectId]?.name || subjectId;
    setSubjects(prev => {
      const next = { ...prev };
      delete next[subjectId];
      return next;
    });
    // Cascade delete reference from classes
    setClasses(prev => prev.map(c => ({
      ...c,
      subjects: c.subjects.filter(id => id !== subjectId)
    })));
    // Cascade delete reference from teachers
    setTeachers(prev => prev.map(t => ({
      ...t,
      subjects: t.subjects ? t.subjects.filter(id => id !== subjectId) : []
    })));
    logAction('Removed Subject', actor, `Deleted subject ${subName} (${subjectId}) from registry.`);
  };

  // Results submission/publishing operations
  const saveOrSubmitResult = (resultData, actor) => {
    const existingIdx = results.findIndex(
      r => r.studentId === resultData.studentId && r.classId === resultData.classId && r.term === resultData.term && r.session === resultData.session
    );

    const newResult = {
      id: existingIdx >= 0 ? results[existingIdx].id : 'res_' + Date.now(),
      ...resultData,
      status: 'published' // Saved by teacher is immediately published
    };

    if (existingIdx >= 0) {
      setResults(prev => prev.map((r, i) => i === existingIdx ? newResult : r));
      logAction('Updated Result', actor, `Teacher updated score entries for student ID ${resultData.studentId} in class ${resultData.classId} (Published).`);
    } else {
      setResults(prev => [...prev, newResult]);
      logAction('Created Result', actor, `Teacher submitted scores for student ID ${resultData.studentId} in class ${resultData.classId} (Published).`);
    }
  };

  const publishResult = (resultId, actor) => {
    setResults(prev => prev.map(r => {
      if (r.id === resultId) {
        logAction('Published Result', actor, `Approved and published result for student ID ${r.studentId} in class ${r.classId}.`);
        return { ...r, status: 'published' };
      }
      return r;
    }));
  };

  const unpublishResult = (resultId, actor) => {
    setResults(prev => prev.map(r => {
      if (r.id === resultId) {
        logAction('Unpublished Result', actor, `Withdrew result for student ID ${r.studentId} in class ${r.classId} back to draft.`);
        return { ...r, status: 'draft' };
      }
      return r;
    }));
  };

  const publishClassResults = (classId, term, session, actor) => {
    setResults(prev => prev.map(r => {
      if (r.classId === classId && r.term === term && r.session === session && r.status === 'draft') {
        return { ...r, status: 'published' };
      }
      return r;
    }));
    logAction('Bulk Published Results', actor, `Approved and published all draft results for class ${classId} (${term}, ${session}).`);
  };

  const unpublishClassResults = (classId, term, session, actor) => {
    setResults(prev => prev.map(r => {
      if (r.classId === classId && r.term === term && r.session === session && r.status === 'published') {
        return { ...r, status: 'draft' };
      }
      return r;
    }));
    logAction('Bulk Unpublished Results', actor, `Withdrew all results for class ${classId} (${term}, ${session}) back to draft.`);
  };

  const addPrincipalRemark = (resultId, remark, actor) => {
    setResults(prev => prev.map(r => {
      if (r.id === resultId) {
        logAction('Added Principal Remark', actor, `Saved principal's remark for result ID ${resultId}.`);
        return {
          ...r,
          remarks: {
            ...(r.remarks || {}),
            principal: remark,
            principalName: 'Dr. Joseph Alao',
            principalSignature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50"><path d="M15,25 C30,5 45,45 60,25 S85,5 110,25 S135,15 145,35" fill="none" stroke="%23064e3b" stroke-width="2.5" stroke-linecap="round"/><text x="15" y="45" font-family="cursive" font-size="11" fill="%23064e3b">Dr. Joseph Alao</text></svg>',
            principalDate: new Date().toISOString().split('T')[0]
          }
        };
      }
      return r;
    }));
  };

  // Bulk Principal remarks by performance average bands
  const applyBulkRemarksByBand = (classId, term, session, bands, actor) => {
    const rankings = getClassRanking(classId, term, session);
    
    setResults(prev => prev.map(r => {
      if (r.classId === classId && r.term === term && r.session === session) {
        const studentStats = rankings[r.studentId];
        if (!studentStats) return r;
        
        // Find matching remark band
        const avg = studentStats.average;
        const matchingBand = bands.find(b => avg >= b.min && avg <= b.max);
        const remark = matchingBand ? matchingBand.remark : 'Good effort, keep striving for excellence.';

        return {
          ...r,
          remarks: {
            ...(r.remarks || {}),
            principal: remark,
            principalName: 'Dr. Joseph Alao',
            principalSignature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50"><path d="M15,25 C30,5 45,45 60,25 S85,5 110,25 S135,15 145,35" fill="none" stroke="%23064e3b" stroke-width="2.5" stroke-linecap="round"/><text x="15" y="45" font-family="cursive" font-size="11" fill="%23064e3b">Dr. Joseph Alao</text></svg>',
            principalDate: new Date().toISOString().split('T')[0]
          }
        };
      }
      return r;
    }));
    
    logAction('Applied Bulk Principal Remarks', actor, `Assigned principal comments in bulk by average score bands for class ${classId}.`);
  };

  // Setup/Settings Operations
  const saveGradingScale = (newScale, actor) => {
    setGradingScale(newScale);
    logAction('Configured Grading Scale', actor, 'Updated score range mappings for WAEC assessment.');
  };

  const createClass = (classId, baseName, arm, subjectIds, actor) => {
    const fullName = arm.trim() ? `${baseName.trim()} ${arm.trim()}` : baseName.trim();
    const newClass = { id: classId, name: fullName, baseName: baseName.trim(), arm: arm.trim(), subjects: subjectIds };
    setClasses(prev => [...prev, newClass]);
    logAction('Created Class', actor, `Added class ${fullName} (${classId}) to curriculum.`);
  };

  const updateClassSubjects = (classId, subjectIds, actor) => {
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, subjects: subjectIds } : c));
    logAction('Allocated Class Subjects', actor, `Updated subjects allocation for class ID ${classId}.`);
  };

  const updateClass = (classId, baseName, arm, actor) => {
    const fullName = arm.trim() ? `${baseName.trim()} ${arm.trim()}` : baseName.trim();
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, name: fullName, baseName: baseName.trim(), arm: arm.trim() } : c));
    logAction('Updated Class', actor, `Renamed class ID ${classId} to ${fullName}.`);
  };

  const removeClass = (classId, actor) => {
    setClasses(prev => prev.filter(c => c.id !== classId));
    logAction('Removed Class', actor, `Deleted class ID ${classId} from curriculum.`);
  };

  // Security lookup validation with lockout checks
  const validateLookup = (name, rollNo) => {
    const now = Date.now();

    // Check if locked out
    if (lockoutUntil && now < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      return {
        success: false,
        error: `Too many failed attempts. Lookup is locked. Please try again in ${remainingSeconds} seconds.`,
        locked: true
      };
    }

    const cleanedName = name.trim().toLowerCase();
    const targetRoll = parseInt(rollNo);

    // Find student matching Name + RollNo
    const matchedStudent = students.find(
      s => s.name.trim().toLowerCase() === cleanedName && s.rollNo === targetRoll
    );

    if (!matchedStudent) {
      // Increment failed attempts
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        const lockDuration = 5 * 60 * 1000; // 5 minutes
        const until = now + lockDuration;
        setLockoutUntil(until);
        setFailedAttempts(0);
        return {
          success: false,
          error: 'Maximum lookup attempts exceeded. Access locked for 5 minutes.',
          locked: true
        };
      }

      return {
        success: false,
        error: `Invalid full name or roll number. (${5 - newAttempts} attempts remaining)`,
        locked: false
      };
    }

    // Success - reset attempts
    setFailedAttempts(0);
    setLockoutUntil(null);

    // Find results for this student
    const studentResults = results.filter(r => r.studentId === matchedStudent.id);

    return {
      success: true,
      student: matchedStudent,
      resultsList: studentResults // Let UI check draft/published status
    };
  };

  // Server Database Sync State
  const [isSynced, setIsSynced] = useState(false);
  const [apiActive, setApiActive] = useState(false);

  // Helper to compile the entire database JSON
  const getFullDatabaseJson = () => {
    return {
      classes,
      subjects,
      teachers,
      students,
      results,
      auditLogs,
      gradingScale,
      adminEmail,
      adminPassword,
      schoolName,
      schoolSubtitle,
      schoolLogo,
      schoolMotto,
      schoolAddress,
      reportCardFont,
      reportCardHeaderFont,
      reportCardHeaderFontSize,
      adminName,
      adminAvatar,
      currentSession,
      currentTerm,
      allowStudentReg,
      maintenanceMode
    };
  };

  const saveToServer = async () => {
    try {
      const dbData = getFullDatabaseJson();
      await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbData)
      });
    } catch (e) {
      console.error('Failed to sync changes to server:', e);
    }
  };

  // Sync from server on mount
  useEffect(() => {
    const fetchDb = async () => {
      try {
        const res = await fetch('/api/db');
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'no_db') {
            setApiActive(true);
            const dbData = getFullDatabaseJson();
            await fetch('/api/db', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(dbData)
            });
          } else {
            if (data.classes) setClasses(data.classes);
            if (data.subjects) setSubjects(data.subjects);
            if (data.teachers) setTeachers(data.teachers);
            if (data.students) setStudents(data.students);
            if (data.results) setResults(data.results);
            if (data.auditLogs) setAuditLogs(data.auditLogs);
            if (data.gradingScale) setGradingScale(data.gradingScale);
            if (data.adminEmail) setAdminEmail(data.adminEmail);
            if (data.adminPassword) setAdminPassword(data.adminPassword);
            if (data.schoolName) setSchoolName(data.schoolName);
            if (data.schoolSubtitle) setSchoolSubtitle(data.schoolSubtitle);
            if (data.schoolLogo) setSchoolLogo(data.schoolLogo);
            if (data.schoolMotto) setSchoolMotto(data.schoolMotto);
            if (data.schoolAddress) setSchoolAddress(data.schoolAddress);
            if (data.reportCardFont) setReportCardFont(data.reportCardFont);
            if (data.reportCardHeaderFont) setReportCardHeaderFont(data.reportCardHeaderFont);
            if (data.reportCardHeaderFontSize) setReportCardHeaderFontSize(data.reportCardHeaderFontSize);
            if (data.adminName) setAdminName(data.adminName);
            if (data.adminAvatar) setAdminAvatar(data.adminAvatar);
            if (data.currentSession) setCurrentSession(data.currentSession);
            if (data.currentTerm) setCurrentTerm(data.currentTerm);
            if (data.allowStudentReg !== undefined) setAllowStudentReg(data.allowStudentReg);
            if (data.maintenanceMode !== undefined) setMaintenanceMode(data.maintenanceMode);
            setApiActive(true);
          }
        }
      } catch (err) {
        console.warn('Vite API sync not available, falling back to localStorage.', err);
      } finally {
        setIsSynced(true);
      }
    };
    fetchDb();
  }, []);

  // Sync to server when DB state changes (debounced)
  useEffect(() => {
    if (isSynced && apiActive) {
      const timer = setTimeout(() => {
        saveToServer();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [
    isSynced, apiActive,
    classes, subjects, teachers, students, results, auditLogs, gradingScale,
    adminEmail, adminPassword, schoolName, schoolSubtitle, schoolLogo,
    schoolMotto, schoolAddress, reportCardFont, reportCardHeaderFont,
    reportCardHeaderFontSize, adminName, adminAvatar, currentSession,
    currentTerm, allowStudentReg, maintenanceMode
  ]);

  const exportDatabase = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(getFullDatabaseJson(), null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `higgsfield_db_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDatabase = (importedJson) => {
    try {
      const data = typeof importedJson === 'string' ? JSON.parse(importedJson) : importedJson;
      if (!data.classes || !data.students || !data.teachers) {
        throw new Error("Missing core database arrays.");
      }
      if (data.classes) setClasses(data.classes);
      if (data.subjects) setSubjects(data.subjects);
      if (data.teachers) setTeachers(data.teachers);
      if (data.students) setStudents(data.students);
      if (data.results) setResults(data.results);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      if (data.gradingScale) setGradingScale(data.gradingScale);
      if (data.adminEmail) setAdminEmail(data.adminEmail);
      if (data.adminPassword) setAdminPassword(data.adminPassword);
      if (data.schoolName) setSchoolName(data.schoolName);
      if (data.schoolSubtitle) setSchoolSubtitle(data.schoolSubtitle);
      if (data.schoolLogo) setSchoolLogo(data.schoolLogo);
      if (data.schoolMotto) setSchoolMotto(data.schoolMotto);
      if (data.schoolAddress) setSchoolAddress(data.schoolAddress);
      if (data.reportCardFont) setReportCardFont(data.reportCardFont);
      if (data.reportCardHeaderFont) setReportCardHeaderFont(data.reportCardHeaderFont);
      if (data.reportCardHeaderFontSize) setReportCardHeaderFontSize(data.reportCardHeaderFontSize);
      if (data.adminName) setAdminName(data.adminName);
      if (data.adminAvatar) setAdminAvatar(data.adminAvatar);
      if (data.currentSession) setCurrentSession(data.currentSession);
      if (data.currentTerm) setCurrentTerm(data.currentTerm);
      if (data.allowStudentReg !== undefined) setAllowStudentReg(data.allowStudentReg);
      if (data.maintenanceMode !== undefined) setMaintenanceMode(data.maintenanceMode);

      logAction('Imported Database', 'Administrator', 'Full database import executed successfully.');
      return { success: true };
    } catch (e) {
      console.error('Failed to import database:', e);
      return { success: false, error: e.message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        classes,
        subjects,
        teachers,
        students,
        results,
        auditLogs,
        gradingScale,
        currentRole,
        selectedTeacherId,
        isTeacherLoggedIn,
        viewingResult,
        failedAttempts,
        lockoutUntil,
        setCurrentRole,
        setSelectedTeacherId,
        setIsTeacherLoggedIn,
        loginTeacher,
        logoutTeacher,
        setViewingResult,
        setLockoutUntil,
        setFailedAttempts,
        getGradeInfo,
        getClassRanking,
        addStudent,
        updateStudent,
        removeStudent,
        addTeacher,
        updateTeacher,
        removeTeacher,
        addSubject,
        updateSubject,
        removeSubject,
        saveOrSubmitResult,
        publishResult,
        unpublishResult,
        publishClassResults,
        unpublishClassResults,
        addPrincipalRemark,
        applyBulkRemarksByBand,
        saveGradingScale,
        createClass,
        updateClassSubjects,
        updateClass,
        removeClass,
        validateLookup,
        theme,
        toggleTheme,
        adminPassword,
        setAdminPassword,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        schoolName,
        setSchoolName,
        schoolSubtitle,
        setSchoolSubtitle,
        currentSession,
        setCurrentSession,
        currentTerm,
        setCurrentTerm,
        allowStudentReg,
        setAllowStudentReg,
        maintenanceMode,
        setMaintenanceMode,
        loginAdmin,
        logoutAdmin,
        adminEmail,
        setAdminEmail,
        schoolLogo,
        setSchoolLogo,
        adminName,
        setAdminName,
        adminAvatar,
        setAdminAvatar,
        schoolMotto,
        setSchoolMotto,
        schoolAddress,
        setSchoolAddress,
        reportCardFont,
        setReportCardFont,
        reportCardHeaderFont,
        setReportCardHeaderFont,
        reportCardHeaderFontSize,
        setReportCardHeaderFontSize,
        exportDatabase,
        importDatabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
