// Test instance generation logic
const sampleSeries = [
    {
        id: '1',
        name: 'Daily Morning Aarti',
        status: 'active',
        start_date: '2025-01-01T06:00:00Z',
        duration_minutes: 30,
        location: 'Main Temple',
        deity: 'Lord Ganesha',
        description: 'Daily morning prayers',
        schedule_config: {}
    },
    {
        id: '2',
        name: 'Weekly Hanuman Chalisa',
        status: 'active',
        start_date: '2025-01-07T18:00:00Z',
        duration_minutes: 60,
        location: 'Hanuman Shrine',
        deity: 'Lord Hanuman',
        description: 'Weekly Tuesday prayers',
        schedule_config: {}
    }
];

// Generate instances function (copied from component)
const generatePujaInstances = (seriesData) => {
    const instances = [];
    const today = new Date();

    seriesData.forEach(series => {
        // Generate instances for the next 7 days for testing
        for (let i = 0; i < 7; i++) {
            const instanceDate = new Date(today);
            instanceDate.setDate(today.getDate() + i);

            // Extract time from start_date or use default
            const startDate = new Date(series.start_date);
            const startTime = startDate.toTimeString().slice(0, 5); // HH:MM format

            // Create instance based on schedule_config or intelligent scheduling
            const shouldCreateInstance = shouldCreateInstanceForDate(series, instanceDate);

            if (shouldCreateInstance) {
                instances.push({
                    id: `${series.id}-${instanceDate.toISOString().split('T')[0]}`,
                    title: series.name,
                    date: instanceDate.toISOString().split('T')[0],
                    startTime: startTime,
                    status: 'scheduled',
                    duration: series.duration_minutes || 60,
                    location: series.location || 'Main Temple',
                    priest: 'Test Priest',
                    seriesId: series.id,
                    deity: series.deity,
                    description: series.description
                });
            }
        }
    });

    return instances;
};

// Helper function
const shouldCreateInstanceForDate = (series, date) => {
    const seriesName = series.name?.toLowerCase() || '';

    // Only create instances for active series
    if (series.status !== 'active') return false;

    // Intelligent scheduling based on puja name/type
    if (seriesName.includes('daily') || seriesName.includes('morning') || seriesName.includes('evening')) {
        return true; // Daily pujas
    }

    if (seriesName.includes('weekly') || seriesName.includes('tuesday') || seriesName.includes('hanuman')) {
        return date.getDay() === 2; // Tuesday for Hanuman
    }

    // Default: create instances every few days for other pujas
    return date.getDate() % 3 === 0;
};

// Test the generation
const instances = generatePujaInstances(sampleSeries);
console.log('Generated instances:');
console.log(JSON.stringify(instances, null, 2));
console.log(`Total instances: ${instances.length}`);