import React from 'react';

const FoodFilter = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-3">
        <div className="row g-2">
          <div className="col-md-7">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 rounded-start-3 text-muted">🔍</span>
              <input
                type="text"
                className="form-control border-start-0 py-2 rounded-end-3"
                placeholder="Lebensmittel suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-5">
            <select
              className="form-select py-2 rounded-3 text-secondary fw-semibold"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Alle">Alle Kategorien (جميع الفئات)</option>
              <option value="Bäckerei">🥖 Backwaren (مخبوزات)</option>
              <option value="Obst & Gemüse">🍎 Obst & Gemüse (فواكه وخضار)</option>
              <option value="Gekochtes">🍲 Gekochte Speisen (وجبات مطبوخة)</option>
              <option value="Sonstiges">📦 Sonstiges (أخرى)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodFilter;