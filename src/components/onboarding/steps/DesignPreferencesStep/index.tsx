'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useTheme } from '@/hooks/use-theme';
import { designPreferencesSchema, DesignPreferencesForm } from './types';
import { StyleSelection } from './StyleSelection';
import { ColorPreferences } from './ColorPreferences';
import { FlowerPreferences } from './FlowerPreferences';
import { ServicesSelection } from './ServicesSelection';
import { InspirationSection } from './InspirationSection';

export function DesignPreferencesStep() {
    const { data, updateData } = useOnboardingStore();
    const { currentTheme } = useTheme();
    const [selectedFlowers, setSelectedFlowers] = useState<string[]>(data.flowerPreferences || []);

    const form = useForm<DesignPreferencesForm>({
        resolver: zodResolver(designPreferencesSchema),
        defaultValues: {
            colorScheme: data.colorScheme || {},
            style: data.style || undefined,
            flowerPreferences: data.flowerPreferences || [],
            inspirationUrls: data.inspirationUrls || [],
            services: data.services || [],
            ceremony: data.ceremony || { needed: false },
            reception: data.reception || { needed: false },
            personal: data.personal || { needed: false },
        },
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            updateData({ ...value, flowerPreferences: selectedFlowers });
        });
        return () => subscription.unsubscribe();
    }, [form, updateData, selectedFlowers]);

    return (
        <div className="space-y-8">


            <Form {...form}>
                <form className="space-y-6">
                    <StyleSelection control={form.control} />

                    <ColorPreferences
                        control={form.control}
                        setValue={form.setValue}
                    />

                    <FlowerPreferences
                        selectedFlowers={selectedFlowers}
                        onToggleFlower={(flower) => {
                            setSelectedFlowers(prev =>
                                prev.includes(flower)
                                    ? prev.filter(f => f !== flower)
                                    : [...prev, flower]
                            );
                        }}
                    />

                    <ServicesSelection
                        control={form.control}
                        setValue={form.setValue}
                        getValues={form.getValues}
                        watchServices={form.watch('services')}
                        watchCeremony={form.watch('ceremony')}
                        watchReception={form.watch('reception')}
                        watchPersonal={form.watch('personal')}
                    />

                    <InspirationSection
                        control={form.control}
                        setValue={form.setValue}
                        getValues={form.getValues}
                        watchInspirationUrls={form.watch('inspirationUrls')}
                    />
                </form>
            </Form>
        </div>
    );
}