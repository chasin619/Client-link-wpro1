'use client';

import { ArrowRight, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TypeWriter from 'react-typewriter-effect';

interface HeroSectionProps {
    vendor: {
        business_name: string;
        business_email: string;
        phone: string;
        business_address: string;
        heroTitle?: string;
        heroSubtitle?: string;
        heroImage?: string;
    };
}

export function HeroSection({ vendor }: HeroSectionProps) {
    const { currentTheme, isLoading } = useTheme();
    const [animationStep, setAnimationStep] = useState(0);
    const [typingComplete, setTypingComplete] = useState(false);

    const titleText = vendor.heroTitle || vendor.business_name;

    // Orchestrated animation sequence
    useEffect(() => {
        if (isLoading) return;

        const sequence = [
            { delay: 300, step: 1 },   // Start typing effect
            { delay: 2000, step: 2 },  // Subtitle appears (after typing is done)
            { delay: 2600, step: 3 },  // Buttons appear
            { delay: 3000, step: 4 },  // Contact info appears
        ];

        sequence.forEach(({ delay, step }) => {
            setTimeout(() => setAnimationStep(step), delay);
        });

        // Set typing complete after estimated time
        setTimeout(() => setTypingComplete(true), titleText.length * 100 + 1000);
    }, [isLoading, titleText.length]);

    if (isLoading) {
        return <HeroSkeleton />;
    }

    const getCleanPhoneNumber = (phone: string) => {
        return phone.replace(/[^\d+]/g, '');
    };

    const openMap = () => {
        const address = encodeURIComponent(vendor.business_address);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        if (isIOS) {
            window.open(`maps://maps.google.com/maps?q=${address}`, '_self');
        } else {
            window.open(`https://maps.google.com/?q=${address}`, '_blank');
        }
    };

    const scrollToPortfolio = () => {
        const portfolioElement = document.getElementById('portfolio');
        if (portfolioElement) {
            portfolioElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    // Heartbeat animation variants
    const primaryButtonVariants = {
        animate: {
            scale: [1, 1.08, 1],
            boxShadow: [
                "0 4px 15px rgba(0, 0, 0, 0.1)",
                "0 8px 25px rgba(0, 0, 0, 0.2)",
                "0 4px 15px rgba(0, 0, 0, 0.1)"
            ],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        },
        hover: {
            scale: 1.1,
            y: -3,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        }
    };

    const secondaryButtonVariants = {
        animate: {
            scale: [1, 1.03, 1],
            transition: {
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
            }
        },
        hover: {
            scale: 1.05,
            y: -2,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        }
    };

    return (
        <>
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.8) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                @keyframes floatUp {
                    from {
                        opacity: 0;
                        transform: translateY(100px) scale(0);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes parallaxFloat {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    33% {
                        transform: translateY(-10px) rotate(1deg);
                    }
                    66% {
                        transform: translateY(5px) rotate(-1deg);
                    }
                }

                @keyframes gradientShift {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }

                .hero-badge {
                    opacity: 0;
                    animation: ${animationStep >= 1 ? 'fadeInScale 0.8s ease-out 0s forwards' : 'none'};
                }

                .hero-title {
                    background: linear-gradient(45deg, var(--primary), var(--accent));
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle {
                    opacity: 0;
                    animation: ${animationStep >= 2 ? 'fadeInUp 0.8s ease-out 0.2s forwards' : 'none'};
                }

                .hero-buttons {
                    opacity: 0;
                    animation: ${animationStep >= 3 ? 'floatUp 0.8s ease-out 0s forwards' : 'none'};
                }

                .hero-contact {
                    opacity: 0;
                    animation: ${animationStep >= 4 ? 'fadeInUp 0.8s ease-out 0s forwards' : 'none'};
                }

                .parallax-bg {
                    transform: translateZ(0);
                    animation: parallaxFloat 20s ease-in-out infinite;
                }

                .gradient-button {
                    background: linear-gradient(45deg, var(--primary), var(--accent), var(--primary));
                    background-size: 200% 200%;
                    animation: gradientShift 3s ease infinite;
                    color: white;
                    border: none;
                }

                .contact-item {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .contact-item:hover {
                    transform: translateY(-2px) scale(1.05);
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .typewriter-text {
                    font-family: ${currentTheme.fonts.heading};
                }
            `}</style>

            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background Pattern */}
                <div
                    className="absolute inset-0 opacity-30 parallax-bg"
                    style={{ background: currentTheme.patterns.hero }}
                />

                {/* Enhanced Background Image with Parallax */}
                {vendor.heroImage && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-20"
                        style={{
                            backgroundImage: `url(${vendor.heroImage})`,
                            transform: 'translateZ(0) scale(1.1)',
                            animation: 'parallaxFloat 15s ease-in-out infinite'
                        }}
                    />
                )}

                {/* Main Content */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div>
                        {/* Animated Business Badge */}
                        <Badge
                            variant="secondary"
                            className="hero-badge mb-4 px-4 py-2 text-sm font-medium theme-transition"
                        >
                            Professional Wedding Florist
                        </Badge>

                        {/* Typewriter Title */}
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 theme-heading">
                            {animationStep >= 1 && (
                                <span className="hero-title typewriter-text">
                                    <TypeWriter
                                        textStyle={{
                                            fontFamily: currentTheme.fonts.heading,
                                            background: 'linear-gradient(45deg, var(--primary), var(--accent))',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontSize: 'inherit',
                                            fontWeight: 'inherit'
                                        }}
                                        startDelay={0}
                                        cursorColor="var(--primary)"
                                        multiText={[titleText]}
                                        multiTextDelay={1000}
                                        typeSpeed={80}
                                        hideCursorAfterText={true}
                                    />
                                </span>
                            )}
                        </h1>

                        {/* Animated Subtitle */}
                        <p
                            className="hero-subtitle text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground"
                            style={{ fontFamily: currentTheme.fonts.body }}
                        >
                            {vendor.heroSubtitle || `Creating beautiful, memorable floral arrangements for your special day. Let us bring your wedding vision to life with stunning, personalized designs.`}
                        </p>

                        {/* Enhanced CTA Buttons with Heartbeat Animation */}
                        <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <motion.div
                                variants={primaryButtonVariants}
                                animate="animate"
                                whileHover="hover"
                            >
                                <Button
                                    onClick={() => window.location.href = '/roses-by-sarah/onboard/quick'}
                                    size="lg"
                                    className="gradient-button px-8 py-6 text-lg font-semibold w-full sm:w-auto"
                                    style={{
                                        borderRadius: currentTheme.components.button.borderRadius,
                                    }}
                                >
                                    Start Planning
                                    <motion.div
                                        animate={{
                                            x: [0, 3, 0],
                                            transition: {
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }
                                        }}
                                    >
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </motion.div>
                                </Button>
                            </motion.div>

                            <motion.div
                                variants={secondaryButtonVariants}
                                animate="animate"
                                whileHover="hover"
                            >
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-6 text-lg w-full sm:w-auto"
                                    onClick={scrollToPortfolio}
                                    style={{
                                        borderRadius: currentTheme.components.button.borderRadius,
                                    }}
                                >
                                    View Portfolio
                                </Button>
                            </motion.div>
                        </div>

                        {/* Animated Contact Info */}
                        <div className="hero-contact flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                            <motion.button
                                onClick={openMap}
                                className="contact-item flex items-center gap-2 hover:text-foreground cursor-pointer bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                                aria-label={`Open map to ${vendor.business_address}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <MapPin className="h-4 w-4" />
                                <span>{vendor.business_address}</span>
                            </motion.button>

                            <motion.a
                                href={`tel:${getCleanPhoneNumber(vendor.phone)}`}
                                className="contact-item flex items-center gap-2 hover:text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                                aria-label={`Call ${vendor.phone}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Phone className="h-4 w-4" />
                                <span>{vendor.phone}</span>
                            </motion.a>

                            <motion.a
                                href={`mailto:${vendor.business_email}?subject=Wedding Inquiry - ${vendor.business_name}&body=Hello, I'm interested in your wedding floral services. Please let me know your availability and pricing.`}
                                className="contact-item flex items-center gap-2 hover:text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                                aria-label={`Send email to ${vendor.business_email}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Mail className="h-4 w-4" />
                                <span>{vendor.business_email}</span>
                            </motion.a>
                        </div>
                    </div>
                </div>

                {/* Enhanced Decorative Wave */}
                <div className="absolute bottom-0 left-0 right-0"  >
                    <svg viewBox="0 0 1440 320" className="w-full h-auto">
                        <path
                            fill="rgba(var(--color-background), 0.8)"
                            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        />
                    </svg>
                </div>
            </section >
        </>
    );
}

function HeroSkeleton() {
    return (
        <section className="min-h-screen flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                <div className="h-8 w-48 bg-muted animate-pulse rounded mx-auto" />
                <div className="h-16 w-full bg-muted animate-pulse rounded" />
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded mx-auto" />
                <div className="flex gap-4 justify-center">
                    <div className="h-12 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-12 w-32 bg-muted animate-pulse rounded" />
                </div>
            </div>
        </section>
    );
}