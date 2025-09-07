// NutriTrack Pro - Enhanced JavaScript with AI Functionality

// Enhanced Food Database with AI-retrieved items

const defaultProfile = {
  name:'', gender:'male', age:30, weight:70, height:170,
  goal:{type:'maintain', deltaKg:0, weeks:0},
  macros:{protein:0, carbs:0, fat:0, fiber:0},
  micros:{}, calorieGoal:2000
};
function getProfile(){ return JSON.parse(localStorage.getItem('nt_profile')||JSON.stringify(defaultProfile)); }
function setProfile(p){ localStorage.setItem('nt_profile',JSON.stringify(p)); }

function kcalMaintenance(p){           // Mifflin-St Jeor
  const s = p.gender==='male'?5:-161;
  return Math.round( (10*p.weight)+(6.25*p.height)-(5*p.age)+s );
}
function applyGoal(p){
  const kcal = kcalMaintenance(p);
  if(p.goal.type==='loss'){
     const deficitPerKg = 7700;
     const kcalDef = (p.goal.deltaKg*deficitPerKg)/(p.goal.weeks*7);
     p.calorieGoal = kcal - kcalDef;
  }else if(p.goal.type==='gain'){
     const surplus = 250 * p.goal.deltaKg; // simple model
     p.calorieGoal = kcal + surplus;
  }else p.calorieGoal = kcal;
  // Split macros: 25 % protein | 45 % carb | 30 % fat
  p.macros = {
    protein : +(p.calorieGoal*0.25/4 ).toFixed(0),
    carbs   : +(p.calorieGoal*0.45/4 ).toFixed(0),
    fat     : +(p.calorieGoal*0.30/9 ).toFixed(0),
    fiber   : 30
  };
}

const foodDatabase = {
    "rice_basmati_cooked": {
        "name": "Basmati Rice (Cooked)",
        "category": "Grains & Cereals",
        "serving_size": "100g",
        "calories": 121,
        "source": "database",
        "macronutrients": {"protein": 2.6, "carbohydrates": 25.2, "fat": 0.4, "fiber": 0.4, "sugar": 0.1},
        "micronutrients": {"vitamin_a": 0, "vitamin_c": 0, "vitamin_d": 0, "vitamin_e": 0.11, "vitamin_k": 0.1, "thiamin_b1": 0.02, "riboflavin_b2": 0.01, "niacin_b3": 1.5, "vitamin_b6": 0.09, "folate": 3, "vitamin_b12": 0, "biotin": 1.1, "pantothenic_acid": 0.39, "choline": 5.8, "calcium": 10, "iron": 0.2, "magnesium": 12, "phosphorus": 43, "potassium": 35, "sodium": 1, "zinc": 0.49, "copper": 0.069, "manganese": 0.472, "selenium": 7.5, "chromium": 0.4, "molybdenum": 12.7, "iodine": 1.5}
    },
    "the_whole_truth_whey_concentrate": {
        "name": "The Whole Truth Whey Concentrate",
        "category": "Supplements",
        "serving_size": "30g (1 scoop)",
        "calories": 115,
        "source": "perplexity_api",
        "brand": "The Whole Truth",
        "confidence": 92,
        "macronutrients": {"protein": 24.0, "carbohydrates": 2.5, "fat": 1.2, "fiber": 0.5, "sugar": 1.8},
        "micronutrients": {"vitamin_a": 0, "vitamin_c": 0, "vitamin_d": 0, "vitamin_e": 0, "vitamin_k": 0, "thiamin_b1": 0, "riboflavin_b2": 0, "niacin_b3": 0, "vitamin_b6": 0, "folate": 0, "vitamin_b12": 0, "biotin": 0, "pantothenic_acid": 0, "choline": 0, "calcium": 120, "iron": 0.5, "magnesium": 25, "phosphorus": 95, "potassium": 180, "sodium": 65, "zinc": 0.8, "copper": 0, "manganese": 0, "selenium": 0, "chromium": 0, "molybdenum": 0, "iodine": 0},
        "additional_info": {
            "ingredients": ["Whey Protein Concentrate", "Natural Flavors", "Stevia Extract"],
            "allergens": ["Milk"],
            "certifications": ["No Artificial Colors", "No Preservatives"]
        }
    },
    "chicken_breast_grilled": {
        "name": "Chicken Breast (Grilled)",
        "category": "Meat & Poultry",
        "serving_size": "100g",
        "calories": 165,
        "source": "database",
        "macronutrients": {"protein": 31.0, "carbohydrates": 0, "fat": 3.6, "fiber": 0, "sugar": 0},
        "micronutrients": {"vitamin_a": 21, "vitamin_c": 0, "vitamin_d": 0.2, "vitamin_e": 0.27, "vitamin_k": 0.4, "thiamin_b1": 0.07, "riboflavin_b2": 0.12, "niacin_b3": 10.9, "vitamin_b6": 0.6, "folate": 4, "vitamin_b12": 0.34, "biotin": 1.5, "pantothenic_acid": 0.91, "choline": 85.3, "calcium": 15, "iron": 0.7, "magnesium": 29, "phosphorus": 228, "potassium": 256, "sodium": 74, "zinc": 0.9, "copper": 0.04, "manganese": 0.02, "selenium": 26.4, "chromium": 0.5, "molybdenum": 3.0, "iodine": 7.0}
    },
    "spinach_raw": {
        "name": "Spinach (Raw)",
        "category": "Vegetables",
        "serving_size": "100g",
        "calories": 23,
        "source": "database",
        "macronutrients": {"protein": 2.9, "carbohydrates": 3.6, "fat": 0.4, "fiber": 2.2, "sugar": 0.4},
        "micronutrients": {"vitamin_a": 469, "vitamin_c": 28.1, "vitamin_d": 0, "vitamin_e": 2.03, "vitamin_k": 483, "thiamin_b1": 0.08, "riboflavin_b2": 0.19, "niacin_b3": 0.72, "vitamin_b6": 0.2, "folate": 194, "vitamin_b12": 0, "biotin": 0.1, "pantothenic_acid": 0.07, "choline": 19.3, "calcium": 99, "iron": 2.7, "magnesium": 79, "phosphorus": 49, "potassium": 558, "sodium": 79, "zinc": 0.53, "copper": 0.13, "manganese": 0.9, "selenium": 1.0, "chromium": 0.2, "molybdenum": 0.5, "iodine": 12.0}
    }
};

// Daily requirements for male adult
const dailyRequirements = {
    calories: 2000,
    protein: 125,
    carbohydrates: 250,
    fat: 67,
    fiber: 25,
    vitamin_a: 900,
    vitamin_c: 90,
    vitamin_d: 20,
    vitamin_e: 15,
    vitamin_k: 120,
    thiamin_b1: 1.2,
    riboflavin_b2: 1.3,
    niacin_b3: 16,
    vitamin_b6: 1.7,
    folate: 400,
    vitamin_b12: 2.4,
    calcium: 1300,
    iron: 18,
    magnesium: 420,
    phosphorus: 1250,
    potassium: 4700,
    sodium: 2300,
    zinc: 11
};

// App state
let currentScreen = 'dashboard';
let selectedFood = null;
let customFoods = [];
let aiSearchHistory = [];
let currentSearchMode = 'database';
let apiUsage = { current: 12, limit: 1000 };
let foodLog = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
};

// API Configuration
const perplexityConfig = {
    baseUrl: 'https://api.perplexity.ai/chat/completions',
    model: 'sonar-pro',
    maxTokens: 1000,
    temperature: 0.3
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupCharts();
    setupModals();
    setupFoodSearch();
    setupAISearch();
    setupCustomFoodForm();
    setupAPISettings();
    loadInitialData();
    updateAPIStatus();
}

// Enhanced Navigation with AI Search
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const screen = this.dataset.screen;
            switchScreen(screen);
            
            // Update active navigation
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Add meal buttons
    const addMealBtns = document.querySelectorAll('.add-meal-btn');
    addMealBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const meal = this.dataset.meal;
            switchScreen('add-food');
            document.getElementById('meal-select').value = meal;
        });
    });

    // Search mode toggle
    const modeBtns = document.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            switchSearchMode(mode);
            
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.getElementById(screenName).classList.add('active');
    currentScreen = screenName;
    
    if (screenName === 'analytics') {
        updateAnalyticsCharts();
    } else if (screenName === 'ai-search') {
        loadRecentSearches();
    }
}

function switchSearchMode(mode) {
    currentSearchMode = mode;
    const aiSearchBtn = document.getElementById('ai-search-btn');
    const searchTips = document.getElementById('ai-search-tips');
    const foodSearch = document.getElementById('food-search');
    
    if (mode === 'ai') {
        aiSearchBtn.classList.remove('hidden');
        searchTips.classList.remove('hidden');
        foodSearch.placeholder = "Search branded foods (e.g., 'Optimum Nutrition Gold Standard Whey')";
    } else {
        aiSearchBtn.classList.add('hidden');
        searchTips.classList.add('hidden');
        foodSearch.placeholder = "Search for foods...";
    }
    
    filterFoods();
}

// AI Search Functionality
function setupAISearch() {
    // Main AI search button
    const aiSearchBtn = document.getElementById('ai-search-btn');
    aiSearchBtn.addEventListener('click', function() {
        const query = document.getElementById('food-search').value.trim();
        if (query) {
            performAISearch(query);
        }
    });

    // Branded search button in AI Search screen
    const brandedSearchBtn = document.getElementById('branded-search-btn');
    brandedSearchBtn.addEventListener('click', function() {
        const query = document.getElementById('ai-food-search').value.trim();
        if (query) {
            performAISearch(query);
        }
    });

    // Example chips
    const exampleChips = document.querySelectorAll('.example-chip');
    exampleChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const searchTerm = this.dataset.search;
            document.getElementById('ai-food-search').value = searchTerm;
            performAISearch(searchTerm);
        });
    });

    // Enter key support
    document.getElementById('ai-food-search').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                performAISearch(query);
            }
        }
    });

    document.getElementById('food-search').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && currentSearchMode === 'ai') {
            const query = this.value.trim();
            if (query) {
                performAISearch(query);
            }
        }
    });
}

async function performAISearch(query) {
    const apiKey = getApiKey();
    if (!apiKey) {
        showError('Please set your Perplexity API key in Profile settings');
        return;
    }

    showAILoading(true);
    
    try {
        const nutritionData = await searchBrandedFood(query, apiKey);
        
        if (nutritionData) {
            const foodItem = parseAIResponse(nutritionData, query);
            displayAIResults([foodItem]);
            addToSearchHistory(query);
            updateApiUsage();
        } else {
            showError('No nutrition data found for this item');
        }
    } catch (error) {
        console.error('AI Search Error:', error);
        showError('Failed to fetch nutrition data. Please check your API key and connection.');
    }
    
    showAILoading(false);
}

async function searchBrandedFood(foodName, apiKey) {
    const prompt = `Find detailed nutritional information for ${foodName}. Include: calories per serving, protein, carbohydrates, fat, fiber, sugar, and any available micronutrients (vitamins and minerals). Also include serving size, ingredients list, and allergen information if available. Format as structured data with numerical values only.`;
    
    try {
        const response = await fetch(perplexityConfig.baseUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: perplexityConfig.model,
                messages: [{role: 'user', content: prompt}],
                max_tokens: perplexityConfig.maxTokens,
                temperature: perplexityConfig.temperature
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content;
    } catch (error) {
        console.error('Perplexity API Error:', error);
        throw error;
    }
}

function parseAIResponse(response, originalQuery) {
    // This is a simplified parser - in a real app, you'd need more robust parsing
    // For demo purposes, we'll create a mock response based on the query
    
    const mockData = {
        name: originalQuery,
        category: "Supplements",
        serving_size: "30g",
        calories: 120,
        source: "perplexity_api",
        confidence: Math.floor(Math.random() * 20) + 75, // Random confidence between 75-95%
        macronutrients: {
            protein: 24.0,
            carbohydrates: 3.0,
            fat: 1.5,
            fiber: 0.5,
            sugar: 2.0
        },
        micronutrients: {
            vitamin_a: 0, vitamin_c: 0, vitamin_d: 0, vitamin_e: 0, vitamin_k: 0,
            thiamin_b1: 0, riboflavin_b2: 0, niacin_b3: 0, vitamin_b6: 0, folate: 0,
            vitamin_b12: 0, biotin: 0, pantothenic_acid: 0, choline: 0,
            calcium: 100, iron: 1.0, magnesium: 30, phosphorus: 80, potassium: 150,
            sodium: 50, zinc: 1.0, copper: 0, manganese: 0, selenium: 0,
            chromium: 0, molybdenum: 0, iodine: 0
        },
        additional_info: {
            ingredients: ["Whey Protein", "Natural Flavors"],
            allergens: ["Milk"],
            certifications: []
        }
    };
    
    // Add to database for future reference
    const key = 'ai_' + Date.now();
    foodDatabase[key] = mockData;
    
    return { key, data: mockData };
}

function displayAIResults(results) {
    const container = document.getElementById('ai-results');
    container.innerHTML = '';
    
    results.forEach(result => {
        const item = document.createElement('div');
        item.className = 'food-result-item ai-result';
        item.innerHTML = `
            <div class="food-info">
                <div class="food-icon">🥤</div>
                <div class="food-details">
                    <span class="food-name">${result.data.name}</span>
                    <span class="food-category">${result.data.category}</span>
                    <span class="ai-badge">AI</span>
                    <div class="confidence-mini">Confidence: ${result.data.confidence}%</div>
                </div>
            </div>
            <span class="food-calories">${result.data.calories} cal/${result.data.serving_size}</span>
        `;
        
        item.addEventListener('click', function() {
            showFoodDetail(result.key);
        });
        
        container.appendChild(item);
    });
}

function showAILoading(show) {
    const loadingElements = [
        document.getElementById('ai-loading'),
        document.getElementById('ai-main-loading')
    ];
    
    loadingElements.forEach(element => {
        if (element) {
            if (show) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        }
    });
}

function addToSearchHistory(query) {
    if (!aiSearchHistory.includes(query)) {
        aiSearchHistory.unshift(query);
        if (aiSearchHistory.length > 10) {
            aiSearchHistory.pop();
        }
        updateRecentSearches();
    }
}

function updateRecentSearches() {
    const container = document.querySelector('.recent-list');
    if (!container) return;
    
    container.innerHTML = '';
    aiSearchHistory.forEach(query => {
        const item = document.createElement('div');
        item.className = 'recent-search-item';
        item.innerHTML = `
            <span>${query}</span>
            <button class="btn btn--sm btn--outline" onclick="performAISearch('${query}')">Search Again</button>
        `;
        container.appendChild(item);
    });
}

function loadRecentSearches() {
    updateRecentSearches();
}

// API Settings
function setupAPISettings() {
    const apiKeyInput = document.getElementById('api-key-input');
    const autoSaveToggle = document.getElementById('auto-save-toggle');
    const confidenceSelect = document.getElementById('confidence-select');
    
    // Load saved settings
    const savedKey = localStorage.getItem('perplexity_api_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }
    
    // Save API key
    apiKeyInput.addEventListener('blur', function() {
        if (this.value.trim()) {
            localStorage.setItem('perplexity_api_key', this.value.trim());
            updateAPIStatus();
        }
    });
    
    // Auto-save toggle
    autoSaveToggle.addEventListener('change', function() {
        localStorage.setItem('auto_save_ai', this.checked);
    });
    
    // Load auto-save setting
    const autoSave = localStorage.getItem('auto_save_ai');
    if (autoSave === 'true') {
        autoSaveToggle.checked = true;
    }
}

function getApiKey() {
    return localStorage.getItem('perplexity_api_key');
}

function updateAPIStatus() {
    const statusElement = document.getElementById('api-connection-status');
    const usageElement = document.getElementById('api-usage');
    
    if (statusElement) {
        const hasKey = !!getApiKey();
        statusElement.textContent = hasKey ? 'Connected' : 'No API Key';
        statusElement.className = hasKey ? 'status--success' : 'status--error';
    }
    
    if (usageElement) {
        usageElement.textContent = `${apiUsage.current} / ${apiUsage.limit} queries`;
    }
}

function updateApiUsage() {
    apiUsage.current += 1;
    updateAPIStatus();
}

// Enhanced Modal functionality
function setupModals() {
    const foodDetailModal = document.getElementById('food-detail-modal');
    const customFoodModal = document.getElementById('custom-food-modal');
    
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.add('hidden');
        });
    });
    
    // Click outside to close
    [foodDetailModal, customFoodModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Food result items
    document.querySelectorAll('.food-result-item').forEach(item => {
        item.addEventListener('click', function() {
            const foodKey = this.dataset.food;
            showFoodDetail(foodKey);
        });
    });
    
    // Add to diary button
    document.getElementById('add-to-diary').addEventListener('click', function() {
        addFoodToDiary();
    });
    
    // Verify data button
    document.getElementById('verify-data-btn').addEventListener('click', function() {
        if (selectedFood && selectedFood.data.source === 'perplexity_api') {
            showVerificationDialog();
        }
    });
    
    // Create custom food button
    document.getElementById('create-custom-btn').addEventListener('click', function() {
        customFoodModal.classList.remove('hidden');
    });
    
    // Cancel custom food
    document.getElementById('cancel-custom').addEventListener('click', function() {
        customFoodModal.classList.add('hidden');
        document.getElementById('custom-food-form').reset();
    });
}

function showFoodDetail(foodKey) {
    const food = foodDatabase[foodKey];
    if (!food) return;
    
    selectedFood = { key: foodKey, data: food };
    
    // Update modal content
    document.getElementById('modal-food-name').textContent = food.name;
    document.getElementById('modal-food-icon').textContent = getFoodIcon(food.category);
    
    // Update data source badge
    const sourceBadge = document.getElementById('modal-data-source');
    const sourceIcon = sourceBadge.querySelector('.source-icon');
    const sourceText = sourceBadge.querySelector('.source-text');
    
    if (food.source === 'perplexity_api') {
        sourceIcon.textContent = '🤖';
        sourceText.textContent = 'AI Retrieved';
        
        // Show confidence indicator
        const confidenceIndicator = document.getElementById('confidence-indicator');
        confidenceIndicator.classList.remove('hidden');
        
        const confidenceFill = document.getElementById('confidence-fill');
        const confidenceText = document.getElementById('confidence-text');
        
        confidenceFill.style.width = `${food.confidence}%`;
        confidenceText.textContent = `AI Confidence: ${food.confidence}%`;
        
        // Show verify button
        document.getElementById('verify-data-btn').classList.remove('hidden');
        
        // Show additional info
        displayAdditionalInfo(food.additional_info);
    } else {
        sourceIcon.textContent = '📊';
        sourceText.textContent = 'Database';
        document.getElementById('confidence-indicator').classList.add('hidden');
        document.getElementById('verify-data-btn').classList.add('hidden');
    }
    
    updateNutritionDisplay(food, 1);
    
    document.getElementById('food-detail-modal').classList.remove('hidden');
    
    // Setup serving size change
    document.getElementById('serving-size').addEventListener('change', function() {
        const multiplier = parseFloat(this.value);
        updateNutritionDisplay(food, multiplier);
    });
}

function displayAdditionalInfo(additionalInfo) {
    const container = document.getElementById('additional-info');
    
    if (!additionalInfo) {
        container.innerHTML = '';
        return;
    }
    
    let html = '<h5>Additional Information</h5>';
    
    if (additionalInfo.ingredients && additionalInfo.ingredients.length > 0) {
        html += `
            <div class="info-item">
                <div class="info-label">Ingredients:</div>
                <div class="info-value">${additionalInfo.ingredients.join(', ')}</div>
            </div>
        `;
    }
    
    if (additionalInfo.allergens && additionalInfo.allergens.length > 0) {
        html += `
            <div class="info-item">
                <div class="info-label">Allergens:</div>
                <div class="allergen-list">
                    ${additionalInfo.allergens.map(allergen => `<span class="allergen-tag">${allergen}</span>`).join('')}
                </div>
            </div>
        `;
    }
    
    if (additionalInfo.certifications && additionalInfo.certifications.length > 0) {
        html += `
            <div class="info-item">
                <div class="info-label">Certifications:</div>
                <div class="info-value">${additionalInfo.certifications.join(', ')}</div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function showVerificationDialog() {
    alert('This feature allows you to verify and edit AI-retrieved nutrition data. In a full implementation, this would open an editing interface.');
}

function updateNutritionDisplay(food, multiplier) {
    // Update macronutrients
    document.getElementById('modal-calories').textContent = Math.round(food.calories * multiplier);
    document.getElementById('modal-protein').textContent = (food.macronutrients.protein * multiplier).toFixed(1) + 'g';
    document.getElementById('modal-carbs').textContent = (food.macronutrients.carbohydrates * multiplier).toFixed(1) + 'g';
    document.getElementById('modal-fat').textContent = (food.macronutrients.fat * multiplier).toFixed(1) + 'g';
    document.getElementById('modal-fiber').textContent = (food.macronutrients.fiber * multiplier).toFixed(1) + 'g';
    
    // Update vitamins and minerals
    updateMicronutrientDisplay(food, multiplier);
}

function updateMicronutrientDisplay(food, multiplier) {
    // Update vitamins
    const vitaminsList = document.getElementById('vitamins-list');
    vitaminsList.innerHTML = '';
    
    const vitamins = [
        { key: 'vitamin_a', name: 'Vitamin A', unit: 'μg', req: dailyRequirements.vitamin_a },
        { key: 'vitamin_c', name: 'Vitamin C', unit: 'mg', req: dailyRequirements.vitamin_c },
        { key: 'vitamin_d', name: 'Vitamin D', unit: 'μg', req: dailyRequirements.vitamin_d },
        { key: 'vitamin_e', name: 'Vitamin E', unit: 'mg', req: dailyRequirements.vitamin_e },
        { key: 'vitamin_k', name: 'Vitamin K', unit: 'μg', req: dailyRequirements.vitamin_k },
        { key: 'folate', name: 'Folate', unit: 'μg', req: dailyRequirements.folate },
        { key: 'vitamin_b12', name: 'B12', unit: 'μg', req: dailyRequirements.vitamin_b12 }
    ];
    
    vitamins.forEach(vitamin => {
        const value = food.micronutrients[vitamin.key] * multiplier;
        const percent = Math.round((value / vitamin.req) * 100);
        
        const item = document.createElement('div');
        item.className = 'micronutrient-item';
        item.innerHTML = `
            <span class="micronutrient-name">${vitamin.name}</span>
            <div>
                <span class="micronutrient-value">${value.toFixed(1)}${vitamin.unit}</span>
                <span class="micronutrient-percent">(${percent}%)</span>
            </div>
        `;
        vitaminsList.appendChild(item);
    });
    
    // Update minerals
    const mineralsList = document.getElementById('minerals-list');
    mineralsList.innerHTML = '';
    
    const minerals = [
        { key: 'calcium', name: 'Calcium', unit: 'mg', req: dailyRequirements.calcium },
        { key: 'iron', name: 'Iron', unit: 'mg', req: dailyRequirements.iron },
        { key: 'magnesium', name: 'Magnesium', unit: 'mg', req: dailyRequirements.magnesium },
        { key: 'phosphorus', name: 'Phosphorus', unit: 'mg', req: dailyRequirements.phosphorus },
        { key: 'potassium', name: 'Potassium', unit: 'mg', req: dailyRequirements.potassium },
        { key: 'sodium', name: 'Sodium', unit: 'mg', req: dailyRequirements.sodium },
        { key: 'zinc', name: 'Zinc', unit: 'mg', req: dailyRequirements.zinc }
    ];
    
    minerals.forEach(mineral => {
        const value = food.micronutrients[mineral.key] * multiplier;
        const percent = Math.round((value / mineral.req) * 100);
        
        const item = document.createElement('div');
        item.className = 'micronutrient-item';
        item.innerHTML = `
            <span class="micronutrient-name">${mineral.name}</span>
            <div>
                <span class="micronutrient-value">${value.toFixed(1)}${mineral.unit}</span>
                <span class="micronutrient-percent">(${percent}%)</span>
            </div>
        `;
        mineralsList.appendChild(item);
    });
}

// Charts setup
function setupCharts() {
    setupCalorieChart();
}

function setupCalorieChart() {
    const ctx = document.getElementById('calorieChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [1240, 760],
                backgroundColor: ['#1FB8CD', '#FFC185'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '80%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updateAnalyticsCharts() {
    const ctx = document.getElementById('caloriesTrendChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Calories',
                    data: [1850, 2100, 1920, 2300, 1980, 2150, 1404],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 1500,
                        max: 2500
                    }
                }
            }
        });
    }
}

// Enhanced Food Search
function setupFoodSearch() {
    const searchInput = document.getElementById('food-search');
    const categoryChips = document.querySelectorAll('.category-chip');
    
    searchInput.addEventListener('input', function() {
        if (currentSearchMode === 'database') {
            filterFoods();
        }
    });
    
    categoryChips.forEach(chip => {
        chip.addEventListener('click', function() {
            categoryChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            filterFoods();
        });
    });
}

function filterFoods() {
    const searchTerm = document.getElementById('food-search').value.toLowerCase();
    const activeCategory = document.querySelector('.category-chip.active').dataset.category;
    const resultsContainer = document.getElementById('food-results');
    
    let filteredFoods = Object.entries(foodDatabase);
    
    // Filter by category
    if (activeCategory !== 'all') {
        filteredFoods = filteredFoods.filter(([key, food]) => 
            food.category === activeCategory
        );
    }
    
    // Filter by search term (only for database mode)
    if (searchTerm && currentSearchMode === 'database') {
        filteredFoods = filteredFoods.filter(([key, food]) => 
            food.name.toLowerCase().includes(searchTerm)
        );
    }
    
    // Update results display
    resultsContainer.innerHTML = '';
    filteredFoods.forEach(([key, food]) => {
        const item = document.createElement('div');
        item.className = 'food-result-item';
        item.dataset.food = key;
        
        const aiBadge = food.source === 'perplexity_api' ? '<span class="ai-badge">AI</span>' : '';
        
        item.innerHTML = `
            <div class="food-info">
                <div class="food-icon">${getFoodIcon(food.category)}</div>
                <div class="food-details">
                    <span class="food-name">${food.name}</span>
                    <span class="food-category">${food.category}</span>
                    ${aiBadge}
                </div>
            </div>
            <span class="food-calories">${food.calories} cal/${food.serving_size}</span>
        `;
        
        item.addEventListener('click', function() {
            showFoodDetail(key);
        });
        
        resultsContainer.appendChild(item);
    });
}

// Custom food form (simplified version)
function setupCustomFoodForm() {
    const form = document.getElementById('custom-food-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        createCustomFood();
    });
}

function createCustomFood() {
    const customFood = {
        name: document.getElementById('custom-name').value,
        category: document.getElementById('custom-category').value,
        serving_size: document.getElementById('custom-serving').value,
        calories: parseFloat(document.getElementById('custom-calories').value),
        source: 'custom',
        macronutrients: {
            protein: parseFloat(document.getElementById('custom-protein').value) || 0,
            carbohydrates: parseFloat(document.getElementById('custom-carbs').value) || 0,
            fat: parseFloat(document.getElementById('custom-fat').value) || 0,
            fiber: parseFloat(document.getElementById('custom-fiber').value) || 0,
            sugar: parseFloat(document.getElementById('custom-sugar').value) || 0
        },
        micronutrients: {
            vitamin_a: 0, vitamin_c: 0, vitamin_d: 0, vitamin_e: 0, vitamin_k: 0,
            thiamin_b1: 0, riboflavin_b2: 0, niacin_b3: 0, vitamin_b6: 0, folate: 0,
            vitamin_b12: 0, biotin: 0, pantothenic_acid: 0, choline: 0,
            calcium: 0, iron: 0, magnesium: 0, phosphorus: 0, potassium: 0,
            sodium: 0, zinc: 0, copper: 0, manganese: 0, selenium: 0,
            chromium: 0, molybdenum: 0, iodine: 0
        }
    };
    
    const customKey = 'custom_' + Date.now();
    foodDatabase[customKey] = customFood;
    customFoods.push(customKey);
    
    document.getElementById('custom-food-modal').classList.add('hidden');
    document.getElementById('custom-food-form').reset();
    
    filterFoods();
    showSuccess('Custom food created successfully!');
}

// Food diary functionality
function addFoodToDiary() {
    if (!selectedFood) return;
    
    const meal = document.getElementById('meal-select').value;
    const servingSize = parseFloat(document.getElementById('serving-size').value);
    
    const logEntry = {
        ...selectedFood.data,
        key: selectedFood.key,
        servingMultiplier: servingSize,
        timestamp: new Date()
    };
    
    foodLog[meal].push(logEntry);
    
    document.getElementById('food-detail-modal').classList.add('hidden');
    
    switchScreen('food-log');
    updateFoodLogDisplay();
    updateDashboard();
    
    selectedFood = null;
}

// Utility functions
function getFoodIcon(category) {
    const icons = {
        'Grains & Cereals': '🍚',
        'Vegetables': '🥬',
        'Fruits': '🍌',
        'Meat & Poultry': '🍗',
        'Dairy': '🧀',
        'Pulses & Legumes': '🥘',
        'Nuts & Seeds': '🥜',
        'Supplements': '🥤',
        'Eggs': '🥚',
        'Other': '🍽️'
    };
    return icons[category] || '🍽️';
}

function showError(message) {
    // In a real app, you'd implement a proper toast/notification system
    console.error(message);
    alert(message);
}

function showSuccess(message) {
    console.log(message);
    alert(message);
}

function updateFoodLogDisplay() {
    console.log('Food log updated:', foodLog);
}

function updateDashboard() {
    console.log('Dashboard updated');
}

function loadInitialData() {
    // Load saved data
    const savedSearches = localStorage.getItem('ai_search_history');
    if (savedSearches) {
        aiSearchHistory = JSON.parse(savedSearches);
    }
    
    // Add sample search
    if (aiSearchHistory.length === 0) {
        aiSearchHistory.push('The Whole Truth Whey Concentrate');
    }
    
    console.log('App initialized with AI capabilities');
}
