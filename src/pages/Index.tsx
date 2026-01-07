import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import PhotoAlbum from '@/components/PhotoAlbum';

const API_URL = 'https://functions.poehali.dev/a6e85038-4626-4111-b071-e9dc59fb4e6d';

interface PortfolioImage {
  id: number;
  title: string;
  url: string;
  category: string;
  description?: string;
  display_order: number;
}

interface Review {
  id: number;
  client_name: string;
  review_text: string;
  rating: number;
  created_at?: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  price_from: number;
  icon_name: string;
  display_order: number;
}

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSection, setActiveSection] = useState('home');
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  const [albumStartIndex, setAlbumStartIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioRes, reviewsRes, servicesRes] = await Promise.all([
          fetch(`${API_URL}?action=portfolio`),
          fetch(`${API_URL}?action=reviews`),
          fetch(`${API_URL}?action=services`)
        ]);

        const portfolioData = await portfolioRes.json();
        const reviewsData = await reviewsRes.json();
        const servicesData = await servicesRes.json();

        setPortfolioImages(portfolioData.images || []);
        setReviews(reviewsData.reviews || []);
        setServices(servicesData.services || []);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredImages = selectedCategory === 'all' 
    ? portfolioImages 
    : portfolioImages.filter(img => img.category === selectedCategory);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              LENS ARTISTRY
            </h1>
            <div className="hidden md:flex gap-8">
              {['home', 'portfolio', 'services', 'reviews', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-colors ${
                    activeSection === section ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {section === 'home' ? 'Главная' : 
                   section === 'portfolio' ? 'Портфолио' :
                   section === 'services' ? 'Услуги' :
                   section === 'reviews' ? 'Отзывы' : 'Контакты'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl kaleidoscope-spin"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl kaleidoscope-spin" style={{ animationDelay: '-10s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent rounded-full blur-3xl kaleidoscope-spin" style={{ animationDelay: '-5s' }}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <h2 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              Творческая<br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Фотография
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Превращаю моменты в искусство через призму калейдоскопа эмоций
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => scrollToSection('portfolio')} className="bg-primary hover:bg-primary/90">
                Смотреть работы
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection('contact')}>
                Связаться
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-20 px-6 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold text-center mb-12 animate-fade-in">Портфолио</h2>
          
          {loading ? (
            <div className="text-center py-20">
              <p className="text-foreground/70">Загрузка...</p>
            </div>
          ) : (
          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-12">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="wedding">Свадьбы</TabsTrigger>
              <TabsTrigger value="portrait">Портреты</TabsTrigger>
              <TabsTrigger value="nature">Природа</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image, index) => (
                  <Card 
                    key={image.id}
                    className="overflow-hidden cursor-pointer hover-lift group animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => {
                      setAlbumStartIndex(index);
                      setIsAlbumOpen(true);
                    }}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={image.url} 
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{image.title}</h3>
                          <p className="text-sm text-white/80">Нажмите для просмотра</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          )}
        </div>
      </section>

      <section id="services" className="py-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="container mx-auto relative z-10">
          <h2 className="text-5xl font-bold text-center mb-4">Услуги и Цены</h2>
          <p className="text-center text-foreground/70 mb-12 text-lg">Выберите идеальный пакет для вашей съемки</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="p-6 hover-lift border-2 border-border hover:border-primary transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 rotate-6 hover:rotate-12 transition-transform">
                  <Icon name={service.icon_name as any} className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-3xl font-bold text-primary mb-3">от {service.price_from.toLocaleString()} ₽</p>
                <p className="text-foreground/70 text-sm">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20 px-6 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold text-center mb-12">Отзывы клиентов</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card 
                key={index} 
                className="p-8 hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Icon key={i} name="Star" className="text-accent fill-accent" size={20} />
                  ))}
                </div>
                <p className="text-foreground/90 mb-4 italic">"{review.review_text}"</p>
                <p className="font-semibold text-primary">— {review.client_name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="container mx-auto max-w-2xl text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6">Свяжитесь со мной</h2>
          <p className="text-xl text-foreground/70 mb-8">
            Готов обсудить вашу идею и воплотить её в жизнь
          </p>
          
          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                <Icon name="Mail" className="text-primary" size={24} />
                <div className="text-left">
                  <p className="text-sm text-foreground/60">Email</p>
                  <p className="font-semibold">photo@lensartistry.ru</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
                <Icon name="Phone" className="text-secondary" size={24} />
                <div className="text-left">
                  <p className="text-sm text-foreground/60">Телефон</p>
                  <p className="font-semibold">+7 (999) 123-45-67</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button variant="outline" size="icon" className="w-12 h-12 rounded-full">
                <Icon name="Instagram" size={20} />
              </Button>
              <Button variant="outline" size="icon" className="w-12 h-12 rounded-full">
                <Icon name="Facebook" size={20} />
              </Button>
              <Button variant="outline" size="icon" className="w-12 h-12 rounded-full">
                <Icon name="MessageCircle" size={20} />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-border text-center">
        <p className="text-foreground/60">© 2024 Lens Artistry. Все права защищены.</p>
      </footer>

      <PhotoAlbum
        photos={filteredImages}
        isOpen={isAlbumOpen}
        onClose={() => setIsAlbumOpen(false)}
        initialIndex={albumStartIndex}
      />
    </div>
  );
}