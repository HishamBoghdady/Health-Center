export default function Intro() {
  return (
    <>
      <div style={{ direction: "ltr" }}>
        
        <h1>Welcome in Health Center</h1>

          <div style={{display: 'flex',flexWrap: 'wrap',gap: '0',justifyContent: 'center',
            alignItems: 'center',borderRadius: '12px',overflow: 'hidden',boxShadow: '0 4px 15px rgba(0,0,0,0.2)'}}>
            <img src="/Elmanar.jpg" alt="Elmanar" style={{flex: '1 1 300px',width: '10%',height: 'auto',objectFit: 'cover'}} />

            <img src="/الادمان.png" alt="الادمان" style={{flex: '1 1 300px',width: '10%',height: 'auto',objectFit: 'cover'}} />
          </div>

      </div>
    </>
  )
}