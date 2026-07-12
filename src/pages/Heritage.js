import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Heritage.css';

function Heritage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Leaflet map when component mounts
    if (window.L && document.getElementById('pakistan-map')) {
      // Initialize map centered on Pakistan
      const map = window.L.map('pakistan-map', {
        center: [30.3753, 69.3451], // Pakistan center coordinates
        zoom: 5.5,
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true
      });

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);

      // Custom icon for homeland (gold star)
      const homelandIcon = window.L.divIcon({
        className: 'custom-marker homeland-marker',
        html: `<div class="marker-container">
                <div class="marker-pin homeland-pin">
                  <div class="pin-icon">⭐</div>
                </div>
                <div class="marker-label-map homeland">ضلع تورغر<br/>آبائی وطن</div>
              </div>`,
        iconSize: [50, 60],
        iconAnchor: [25, 60],
        popupAnchor: [0, -60]
      });

      // Custom icon for other cities
      const cityIcon = window.L.divIcon({
        className: 'custom-marker city-marker',
        html: `<div class="marker-container">
                <div class="marker-pin city-pin">
                  <div class="pin-icon">📍</div>
                </div>
              </div>`,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -50]
      });

      // Locations data with coordinates
      const locations = [
        {
          name: 'ضلع تورغر',
          english: 'District Toor Ghar',
          coords: [34.6917, 73.1956], // Toor Ghar/Mansehra area
          icon: homelandIcon,
          isHomeland: true,
          description: 'یارُوخیل کا آبائی وطن'
        },
        {
          name: 'اسلام آباد',
          english: 'Islamabad',
          coords: [33.6844, 73.0479],
          icon: cityIcon,
          description: 'دارالحکومت'
        },
        {
          name: 'راولپنڈی',
          english: 'Rawalpindi',
          coords: [33.5651, 73.0169],
          icon: cityIcon,
          description: 'شہر'
        },
        {
          name: 'صوابی',
          english: 'Swabi',
          coords: [34.1201, 72.4689],
          icon: cityIcon,
          description: 'خیبر پختونخوا'
        },
        {
          name: 'لاہور',
          english: 'Lahore',
          coords: [31.5497, 74.3436],
          icon: cityIcon,
          description: 'پنجاب کا دارالحکومت'
        },
        {
          name: 'کراچی',
          english: 'Karachi',
          coords: [24.8607, 67.0011],
          icon: cityIcon,
          description: 'سندھ کا دارالحکومت'
        }
      ];

      // Add markers to map
      locations.forEach(location => {
        const marker = window.L.marker(location.coords, { icon: location.icon })
          .addTo(map);

        // Create popup content
        const popupContent = `
          <div class="map-popup ${location.isHomeland ? 'homeland-popup' : ''}">
            <h3>${location.name}</h3>
            <p class="english-name">${location.english}</p>
            <p class="description">${location.description}</p>
          </div>
        `;

        marker.bindPopup(popupContent, {
          className: 'custom-popup',
          maxWidth: 250
        });

        // Show homeland popup by default
        if (location.isHomeland) {
          marker.openPopup();
        }
      });

      // Cleanup function
      return () => {
        map.remove();
      };
    }
  }, []);

  return (
    <div className="heritage-page">
      {/* Header */}
      <div className="heritage-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← واپس
        </button>
        <h1 className="heritage-title">یارُوخیل کی تاریخ اور شناخت</h1>
        <p className="heritage-subtitle">پشتون قوم کی ایک عظیم شاخ</p>
      </div>

      {/* Genealogy Tree Section */}
      <div className="genealogy-section">
        <h2 className="section-title">
          <span className="title-icon">🌳</span>
          نسلی شجرہ
        </h2>
        <p className="section-description">
          پشتون قوم کی عظیم الشان تاریخ سے لے کر یارُوخیل تک کا سفر
        </p>

        <div className="tree-container">
          {/* Level 1: Pashtun */}
          <div className="tree-level level-1">
            <div className="tree-node node-pashtun">
              <div className="node-icon">👑</div>
              <div className="node-content">
                <h3>پشتون / پٹھان</h3>
                <p>Pashtun / Pathan</p>
              </div>
              <div className="node-badge">قوم کی جڑ</div>
            </div>
          </div>

          <div className="tree-connector connector-1"></div>

          {/* Level 2: Yousafzai */}
          <div className="tree-level level-2">
            <div className="tree-node node-yousafzai">
              <div className="node-icon">🏔️</div>
              <div className="node-content">
                <h3>یوسفزئی</h3>
                <p>Yousafzai</p>
              </div>
              <div className="node-badge">پشتون کی شاخ</div>
            </div>
          </div>

          <div className="tree-connector connector-2"></div>

          {/* Level 3: Essa Zai */}
          <div className="tree-level level-3">
            <div className="tree-node node-essazai">
              <div className="node-icon">⚔️</div>
              <div className="node-content">
                <h3>عیسیٰ زئی</h3>
                <p>Essa Zai</p>
              </div>
              <div className="node-badge">یوسفزئی کی شاخ</div>
            </div>
          </div>

          <div className="tree-connector connector-3"></div>

          {/* Level 4: Hassan Zai */}
          <div className="tree-level level-4">
            <div className="tree-node node-hassanzai">
              <div className="node-icon">🛡️</div>
              <div className="node-content">
                <h3>حسن زئی</h3>
                <p>Hassan Zai</p>
              </div>
              <div className="node-badge">عیسیٰ زئی کی شاخ</div>
            </div>
          </div>

          <div className="tree-connector connector-4"></div>

          {/* Level 5: Yaru Khel */}
          <div className="tree-level level-5">
            <div className="tree-node node-yarukhel">
              <div className="node-icon">🌟</div>
              <div className="node-content">
                <h3>یارُوخیل</h3>
                <p>Yaru Khel</p>
              </div>
              <div className="node-badge highlight">حسن زئی کی شاخ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Homeland Section */}
      <div className="homeland-section">
        <h2 className="section-title">
          <span className="title-icon">🏡</span>
          آبائی وطن
        </h2>
        <div className="homeland-card">
          <div className="homeland-icon">🏔️</div>
          <h3>ضلع تورغر</h3>
          <p>District Toor Ghar</p>
          <div className="homeland-badge">آبائی وطن</div>
        </div>
      </div>

      {/* Pakistan Map Section */}
      <div className="map-section">
        <h2 className="section-title">
          <span className="title-icon">📍</span>
          پاکستان میں یارُوخیل کی موجودگی
        </h2>
        <p className="section-description">
          یارُوخیل خاندان پاکستان کے مختلف شہروں میں آباد ہیں
        </p>

        <div className="pakistan-map-container">
          {/* Real Interactive Pakistan Map */}
          <div id="pakistan-map" className="real-pakistan-map"></div>
          
          {/* Map Instructions */}
          <div className="map-instructions">
            <p>🖱️ نقشہ کو کھینچیں، زوم کریں اور مارکرز پر کلک کریں</p>
          </div>

          {/* Location Cards */}
          <div className="locations-grid">
            <div className="location-card">
              <div className="location-icon">🏔️</div>
              <h4>ضلع تورغر</h4>
              <p>District Toor Ghar</p>
              <span className="location-badge homeland">آبائی وطن</span>
            </div>

            <div className="location-card">
              <div className="location-icon">🏛️</div>
              <h4>اسلام آباد</h4>
              <p>Islamabad</p>
              <span className="location-badge">دارالحکومت</span>
            </div>

            <div className="location-card">
              <div className="location-icon">🌆</div>
              <h4>راولپنڈی</h4>
              <p>Rawalpindi</p>
              <span className="location-badge">شہر</span>
            </div>

            <div className="location-card">
              <div className="location-icon">🌾</div>
              <h4>صوابی</h4>
              <p>Swabi</p>
              <span className="location-badge">علاقہ</span>
            </div>

            <div className="location-card">
              <div className="location-icon">🏙️</div>
              <h4>لاہور</h4>
              <p>Lahore</p>
              <span className="location-badge">تاریخی شہر</span>
            </div>

            <div className="location-card">
              <div className="location-icon">🌊</div>
              <h4>کراچی</h4>
              <p>Karachi</p>
              <span className="location-badge">بندرگاہ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heritage Stats */}
      <div className="heritage-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <h3>500+</h3>
          <p>ممبران</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <h3>150+</h3>
          <p>خاندان</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🗺️</div>
          <h3>25+</h3>
          <p>دیہات</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <h3>500+</h3>
          <p>سال کی روایت</p>
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="heritage-footer">
        <button className="btn-home" onClick={() => navigate('/')}>
          ← مرکزی صفحہ پر واپس
        </button>
      </div>
    </div>
  );
}

export default Heritage;
