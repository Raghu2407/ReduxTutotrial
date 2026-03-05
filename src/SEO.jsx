export default function SEO({
    title = "Redux Toolkit – Interactive Guide | Learn RTK Without the Headache",
    description = "Learn Redux Toolkit interactively. Explore live Counter, Todos, and Cart demos, understand the Redux data flow, and copy-paste code patterns. No boring docs.",
    url = "https://yourwebsite.com",
    image = "https://yourwebsite.com/og-image.jpg",
}) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Redux Toolkit Interactive Guide",
        description:
            "An interactive learning resource for Redux Toolkit — live demos, flow diagrams, and copy-paste code patterns for Counter, Todos, and Cart slices.",
        url,
        keywords: [
            "Redux Toolkit",
            "RTK tutorial",
            "Redux tutorial",
            "createSlice",
            "configureStore",
            "useSelector",
            "useDispatch",
            "React Redux",
            "Redux interactive demo",
        ],
        author: {
            "@type": "Person",
            name: "Your Name",
        },
        inLanguage: "en-US",
    };

    return (
        <>
            {/* Primary */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta
                name="keywords"
                content="Redux Toolkit, RTK tutorial, createSlice, configureStore, useSelector, useDispatch, React Redux, Redux interactive demo, learn Redux, Redux beginner guide"
            />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />

            {/* WhatsApp / Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Schema */}
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </>
    );
}
