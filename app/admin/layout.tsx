import './admin.css';

export const metadata = {
  title: 'Admin Portal | Institute of Da\'wa Islamiyya',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-portal-wrapper">
      {children}
    </div>
  );
}
