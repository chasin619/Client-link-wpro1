'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';

const portfolioItems = [
    {
        id: 1,
        title: 'Romantic Garden Wedding',
        category: 'Garden',
        image: 'https://images.pexels.com/photos/1045541/pexels-photo-1045541.jpeg', // garden
        likes: 124,
        description: 'Soft pastels with cascading greenery',
    },
    {
        id: 2,
        title: 'Modern Minimalist Ceremony',
        category: 'Modern',
        image: 'https://images.pexels.com/photos/29110841/pexels-photo-29110841.jpeg', // modern
        likes: 89,
        description: 'Clean lines with white orchids',
    },
    {
        id: 3,
        title: 'Rustic Barn Reception',
        category: 'Rustic',
        image: 'https://images.pexels.com/photos/262882/pexels-photo-262882.jpeg', // rustic
        likes: 156,
        description: 'Wildflowers and natural textures',
    },
    {
        id: 4,
        title: 'Elegant Ballroom Affair',
        category: 'Luxury',
        image: 'https://images.pexels.com/photos/2337800/pexels-photo-2337800.jpeg', // luxury
        likes: 203,
        description: 'Sophisticated roses and gold accents',
    },
    {
        id: 5,
        title: 'Bohemian Beach Wedding',
        category: 'Boho',
        image: 'https://images.pexels.com/photos/2487438/pexels-photo-2487438.jpeg', // beach boho
        likes: 145,
        description: 'Free-spirited tropical arrangements',
    },
    {
        id: 6,
        title: 'Classic Church Ceremony',
        category: 'Traditional',
        image: 'https://images.pexels.com/photos/226722/pexels-photo-226722.jpeg', // traditional
        likes: 98,
        description: 'Timeless elegance with white lilies',
    },
];


const categories = ['All', 'Garden', 'Modern', 'Rustic', 'Luxury', 'Boho', 'Traditional'];

export function PortfolioGallery() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { currentTheme, isLoading } = useTheme();

    if (isLoading) {
        return <PortfolioSkeleton />;
    }

    const filteredItems = selectedCategory === 'All'
        ? portfolioItems
        : portfolioItems.filter(item => item.category === selectedCategory);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % filteredItems.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    };

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4">
                        Our Work
                    </Badge>
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-6 theme-heading"
                        style={{ fontFamily: currentTheme.fonts.heading }}
                    >
                        Wedding Portfolio
                    </h2>
                    <p
                        className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
                        style={{ fontFamily: currentTheme.fonts.body }}
                    >
                        Explore our recent wedding projects and get inspired for your special day.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                                setSelectedCategory(category);
                                setCurrentImageIndex(0);
                            }}
                            className="theme-button"
                            style={{
                                borderRadius: currentTheme.components.button.borderRadius,
                                backgroundColor: selectedCategory === category ? currentTheme.colors.primary : 'transparent',
                                borderColor: currentTheme.colors.primary,
                                color: selectedCategory === category ? 'white' : currentTheme.colors.primary,
                            }}
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* Featured Image Display */}
                <div className="relative mb-12">
                    <Card
                        className="overflow-hidden theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <div className="relative h-96 md:h-[500px]">
                            <img
                                src={filteredItems[currentImageIndex]?.image || '/placeholder-wedding.jpg'}
                                alt={filteredItems[currentImageIndex]?.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge
                                        variant="secondary"
                                        style={{ backgroundColor: `${currentTheme.colors.accent}20`, color: 'white' }}
                                    >
                                        {filteredItems[currentImageIndex]?.category}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Heart className="h-4 w-4" />
                                        {filteredItems[currentImageIndex]?.likes}
                                    </div>
                                </div>
                                <h3
                                    className="text-2xl font-bold mb-2"
                                    style={{ fontFamily: currentTheme.fonts.heading }}
                                >
                                    {filteredItems[currentImageIndex]?.title}
                                </h3>
                                <p className="text-white/90">
                                    {filteredItems[currentImageIndex]?.description}
                                </p>
                            </div>

                            {/* Navigation Arrows */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                                onClick={nextImage}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {filteredItems.map((item, index) => (
                        <Card
                            key={item.id}
                            className={`cursor-pointer overflow-hidden theme-card theme-hover ${index === currentImageIndex ? 'ring-2' : ''
                                }`}
                            style={{
                                borderRadius: currentTheme.components.card.borderRadius,
                                // ringColor: currentTheme.colors.primary,
                            }}
                            onClick={() => setCurrentImageIndex(index)}
                        >
                            <div className="relative h-32 group">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                <div className="absolute top-2 right-2">
                                    <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* View More Button */}
                <div className="text-center mt-12">
                    <Button
                        size="lg"
                        variant="outline"
                        className="theme-button px-8"
                    >
                        View Full Portfolio
                    </Button>
                </div>
            </div>
        </section>
    );
}

function PortfolioSkeleton() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 space-y-4">
                    <div className="h-6 w-24 bg-muted animate-pulse rounded mx-auto" />
                    <div className="h-12 w-80 bg-muted animate-pulse rounded mx-auto" />
                    <div className="h-6 w-full max-w-2xl bg-muted animate-pulse rounded mx-auto" />
                </div>
                <div className="flex gap-3 justify-center mb-12">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="h-8 w-20 bg-muted animate-pulse rounded" />
                    ))}
                </div>
                <div className="h-96 bg-muted animate-pulse rounded-lg mb-12" />
                <div className="grid grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-32 bg-muted animate-pulse rounded" />
                    ))}
                </div>
            </div>
        </section>
    );
}