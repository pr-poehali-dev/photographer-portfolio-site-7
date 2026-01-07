CREATE TABLE IF NOT EXISTS portfolio_images (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('wedding', 'portrait', 'nature', 'children')),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    review_text TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price_from INTEGER NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_portfolio_category ON portfolio_images(category);
CREATE INDEX idx_portfolio_order ON portfolio_images(display_order);
CREATE INDEX idx_reviews_published ON reviews(is_published);
CREATE INDEX idx_services_active ON services(is_active);

INSERT INTO portfolio_images (title, url, category, display_order) VALUES
('Свадебная церемония', 'https://cdn.poehali.dev/projects/2ed10d79-95ee-401e-9e47-13fb0462285c/files/16c41f00-5a76-4d3d-a568-7acf704b7c78.jpg', 'wedding', 1),
('Портретная съемка', 'https://cdn.poehali.dev/projects/2ed10d79-95ee-401e-9e47-13fb0462285c/files/3fc3b648-e11d-4500-9b81-91f3b6bcf62c.jpg', 'portrait', 2),
('Пейзажная съемка', 'https://cdn.poehali.dev/projects/2ed10d79-95ee-401e-9e47-13fb0462285c/files/5237db0d-7643-438d-9708-1bc9d77f892c.jpg', 'nature', 3),
('Love Story', 'https://cdn.poehali.dev/projects/2ed10d79-95ee-401e-9e47-13fb0462285c/files/16c41f00-5a76-4d3d-a568-7acf704b7c78.jpg', 'wedding', 4),
('Студийный портрет', 'https://cdn.poehali.dev/projects/2ed10d79-95ee-401e-9e47-13fb0462285c/files/3fc3b648-e11d-4500-9b81-91f3b6bcf62c.jpg', 'portrait', 5),
('Закат в горах', 'https://cdn.poehali.dev/projects/2ed10d79-95ee-401e-9e47-13fb0462285c/files/5237db0d-7643-438d-9708-1bc9d77f892c.jpg', 'nature', 6);

INSERT INTO reviews (client_name, review_text, rating, is_published) VALUES
('Анна и Дмитрий', 'Потрясающие фотографии! Каждый кадр — произведение искусства. Спасибо за сохраненные воспоминания!', 5, true),
('Екатерина', 'Очень профессиональный подход, комфортная атмосфера на съемке. Результат превзошел все ожидания!', 5, true),
('Михаил', 'Креативный фотограф с отличным чувством композиции. Рекомендую всем!', 5, true);

INSERT INTO services (title, description, price_from, icon_name, display_order) VALUES
('Свадебная съемка', 'Полный день съемки с лучшими моментами вашего торжества', 50000, 'Camera', 1),
('Портретная съемка', 'Индивидуальная или семейная фотосессия в студии или на природе', 15000, 'User', 2),
('Пейзажная съемка', 'Профессиональная съемка природы и архитектуры', 20000, 'Mountain', 3),
('Детская съемка', 'Трогательные моменты детства в естественной обстановке', 12000, 'Baby', 4);