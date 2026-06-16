// Authentication Service for HTC Workplace Connect
// Handles simulation of Google OAuth and enforces @htc.ac.th domains.

export const validateEmail = (email) => {
  if (!email) return false;
  return email.toLowerCase().endsWith('@htc.ac.th');
};

export const getCurrentUser = () => {
  const userJson = localStorage.getItem('htc_user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch (e) {
    localStorage.removeItem('htc_user');
    return null;
  }
};

export const loginSimulated = (email, name) => {
  return new Promise((resolve, reject) => {
    // Simulated delay for Google Sign-In popups/verification
    setTimeout(() => {
      if (!validateEmail(email)) {
        reject(new Error('กรุณาเข้าสู่ระบบด้วยบัญชี Google ของวิทยาลัย (@htc.ac.th) เท่านั้น'));
        return;
      }
      
      const defaultPhotos = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      ];
      
      const randomPhoto = defaultPhotos[Math.floor(Math.random() * defaultPhotos.length)];
      
      const user = {
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        photoUrl: randomPhoto,
        department: inferDepartment(email)
      };
      
      localStorage.setItem('htc_user', JSON.stringify(user));
      resolve(user);
    }, 1000);
  });
};

export const logout = () => {
  localStorage.removeItem('htc_user');
};

// Helper to guess department from email if possible (just for fun, e.g. it.student@htc.ac.th)
const inferDepartment = (email) => {
  const prefix = email.split('@')[0].toLowerCase();
  if (prefix.includes('it') || prefix.includes('ict') || prefix.includes('com')) {
    return 'เทคโนโลยีสารสนเทศ';
  }
  if (prefix.includes('acc') || prefix.includes('audit')) {
    return 'การบัญชี';
  }
  if (prefix.includes('auto') || prefix.includes('mech')) {
    return 'ช่างยนต์';
  }
  if (prefix.includes('elec')) {
    return 'ไฟฟ้ากำลัง';
  }
  // Default fallback
  return 'เทคโนโลยีสารสนเทศ';
};
