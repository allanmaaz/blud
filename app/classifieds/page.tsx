import ClassifiedCard, { ClassifiedCardProps } from "@/components/features/ClassifiedCard";

export default function ClassifiedsPage() {
    const ads = [
        {
            category: "LOST",
            title: "Left Moleskine in Lib",
            description: "Black hardcover, beat up. Contains sketches that look like scribbles but they are my thesis. Please return.",
            contact: "@jamie.arch",
        },
        {
            category: "FOR SALE",
            title: "Vintage drafting table",
            description: "Heavy steel base. Adjustable angle. Stained with coffee and tears. Pickup only (North Hall). $50 obo.",
            contact: "Text 555-0123",
        },
        {
            category: "WANTED",
            title: "Drummer for Noise Band",
            description: "Influences: Sonic Youth, washing machines, silence. Must have own gear. Practice Tuesdays.",
            contact: "@noise_collective",
        },
        {
            category: "MISC",
            title: "Ride to city friday?",
            description: "Will pay gas + snacks. Leaving around 4pm.",
            contact: "@sarah_k",
        },
        {
            category: "FOUND",
            title: "Single Airpod (Right)",
            description: "Found on the green near the fountain. It was playing Taylor Swift loudly.",
            contact: "Front Desk",
        },
    ];

    return (
        <div className="max-w-md mx-auto p-6 space-y-8 pt-12 pb-32">
            <header className="space-y-2 text-center border-b-4 border-blud-blue pb-6">
                <h1 className="text-4xl text-blud-blue font-bold font-mono uppercase tracking-tighter">
                    The Classifieds
                </h1>
                <p className="text-blud-blue/60 font-mono text-xs uppercase tracking-widest">
                    Vol. 14 • Issue 402 • Free
                </p>
            </header>

            <div className="columns-1 gap-4 space-y-4">
                {ads.map((ad, i) => (
                    <ClassifiedCard
                        key={i}
                        category={ad.category as ClassifiedCardProps['category']}
                        title={ad.title}
                        description={ad.description}
                        contact={ad.contact}
                        className="break-inside-avoid"
                    />
                ))}

                {/* Fake Filler Ad */}
                <div className="border-2 border-blud-blue border-dashed p-4 text-center font-mono text-blud-blue/40 break-inside-avoid flex items-center justify-center aspect-square">
                    <span className="uppercase text-sm">Your Ad Here<br />(Free for Students)</span>
                </div>
            </div>
        </div>
    );
}
