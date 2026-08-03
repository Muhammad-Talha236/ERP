
const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: LayoutDashboard, title: 'Real-time Dashboard', desc: 'Sales, PO, and production analytics with line/bar charts' },
    { icon: Users, title: 'Employee Management', desc: 'Track attendance, wages, and productivity per employee' },
    { icon: FileText, title: 'Purchase Orders', desc: 'Create and manage POs with workflow assignment' },
    { icon: TrendingUp, title: 'Accounts & P&L', desc: 'Consolidated expenses, revenues, and profit tracking' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 48px',
        background: 'white',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Factory size={32} style={{ color: '#4f46e5' }} />
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>FactoryOS</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 24px',
              border: '2px solid #4f46e5',
              borderRadius: '12px',
              background: 'transparent',
              color: '#4f46e5',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            style={{
              padding: '10px 24px',
              border: 'none',
              borderRadius: '12px',
              background: '#4f46e5',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: '16px',
          lineHeight: '1.2'
        }}>
          Factory Management System
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#475569',
          maxWidth: '600px',
          margin: '0 auto 40px',
          lineHeight: '1.6'
        }}>
          Digitize your factory's full operation — raw material tracking, employee management, 
          production workflows, PO tracking, and financial reporting in one platform.
        </p>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          {[
            { value: '11', label: 'Core Modules' },
            { value: 'Multi-Tenant', label: 'Factory Support' },
            { value: 'Real-time', label: 'Dashboard Analytics' },
            { value: '100%', label: 'Digital Workflow' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#4f46e5' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', color: '#0f172a' }}>
          Everything You Need
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px'
        }}>
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#eef2ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <Icon size={24} style={{ color: '#4f46e5' }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#0f172a' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ marginTop: '60px', padding: '40px', background: '#4f46e5', borderRadius: '24px', color: 'white' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
            Ready to Transform Your Factory?
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '24px' }}>
            Join thousands of factories already using FactoryOS
          </p>
          <button
            onClick={() => navigate('/signup')}
            style={{
              padding: '14px 40px',
              border: 'none',
              borderRadius: '12px',
              background: 'white',
              color: '#4f46e5',
              fontWeight: 700,
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;