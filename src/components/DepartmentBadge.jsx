import React from 'react';
import { 
  Laptop, Cpu, Zap, Radio, Car, Calculator, 
  TrendingUp, Briefcase, Coffee, Compass, HelpCircle 
} from 'lucide-react';

const DEPT_STYLES = {
  'เทคโนโลยีสารสนเทศ': {
    bg: '#eff6ff',
    color: '#2563eb',
    border: '#dbeafe',
    icon: Laptop
  },
  'เทคนิคคอมพิวเตอร์': {
    bg: '#eef2ff',
    color: '#4f46e5',
    border: '#e0e7ff',
    icon: Cpu
  },
  'ไฟฟ้ากำลัง': {
    bg: '#fffbeb',
    color: '#d97706',
    border: '#fef3c7',
    icon: Zap
  },
  'อิเล็กทรอนิกส์': {
    bg: '#fff5f5',
    color: '#e53e3e',
    border: '#fed7d7',
    icon: Radio
  },
  'ช่างยนต์': {
    bg: '#f1f5f9',
    color: '#475569',
    border: '#e2e8f0',
    icon: Car
  },
  'การบัญชี': {
    bg: '#ecfdf5',
    color: '#059669',
    border: '#d1fae5',
    icon: Calculator
  },
  'การตลาด': {
    bg: '#fdf2f8',
    color: '#db2777',
    border: '#fce7f3',
    icon: TrendingUp
  },
  'การจัดการสำนักงาน': {
    bg: '#f0fdfa',
    color: '#0d9488',
    border: '#ccfbf1',
    icon: Briefcase
  },
  'คหกรรมศาสตร์': {
    bg: '#faf5ff',
    color: '#7c3aed',
    border: '#f3e8ff',
    icon: Coffee
  },
  'การท่องเที่ยวและการโรงแรม': {
    bg: '#ecfeff',
    color: '#0891b2',
    border: '#cffafe',
    icon: Compass
  }
};

export default function DepartmentBadge({ deptName }) {
  const style = DEPT_STYLES[deptName] || {
    bg: '#f8fafc',
    color: '#64748b',
    border: '#cbd5e1',
    icon: HelpCircle
  };

  const IconComponent = style.icon;

  return (
    <span 
      className="dept-badge"
      style={{
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '50px',
        fontSize: '0.75rem',
        fontWeight: '600',
        whiteSpace: 'nowrap'
      }}
    >
      <IconComponent size={14} style={{ flexShrink: 0 }} />
      <span>{deptName}</span>
    </span>
  );
}
export { DEPT_STYLES };
