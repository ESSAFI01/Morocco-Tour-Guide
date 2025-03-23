import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from 'react-router-dom';
import Map from './Map/Map';

export default function Hero() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col justify-center items-center h-screen text-white bg-cover bg-center bg-no-repeat bg-[url('./assets/img2.jpg')] relative">
                <div className="absolute inset-0 bg-black opacity-10"></div>

                {/*content positioned above thee overlay */}
                <div className="z-10 flex flex-col items-center max-w-3xl px-4 text-center">
                    <span className="text-xl md:text-4xl font-bold text-center mb-4">
                        Discover Morocco like never before
                    </span>

                    <TypeAnimation
                        sequence={[
                            'Ancient medinas',
                            1000,
                            'Breathtaking landscapes',
                            1000,
                            'Rich cultural heritage',
                            1000,
                            'Unforgettable adventures',
                            1000
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                        className="text-xl md:text-2xl font-semibold text-white"
                    />
                    <button
                        onClick={() => navigate('/chat')}
                        className="mt-10 px-8 py-4 bg-gradient-to-r from-amber-300 to-amber-600 text-white rounded-lg font-medium hover:from-amber-400 hover:to-amber-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                        <span>Chat with our Guide</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                        <svg className="w-8 h-8 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="py-16 bg-gradient-to-b from-black via-gray-900 to-black">
                <div className="container mx-auto px-4">
                    {/* Section title with decorative elements */}
                    <div className="text-center mb-10 relative">
                        <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-16 h-1 bg-amber-500"></div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Journey Through Morocco</h2>
                        <p className="text-amber-300/80 max-w-2xl mx-auto font-light italic">
                            "The world is a book and those who do not travel read only one page"
                        </p>
                    </div>
                    <div className="mx-auto max-w-5xl rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,165,0,0.2)] border border-amber-900/30">
                        <div className="h-[500px] w-full relative">
                            <Map />
                            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-500 opacity-70"></div>
                            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-500 opacity-70"></div>
                        </div>

                        <div className="bg-black/80 backdrop-blur-sm py-3 px-4">
                            <p className="text-gray-300 text-sm text-center">
                                Click on destinations to learn more or ask our guide about them
                            </p>
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: 'Fes', desc: 'Ancient medina' },
                            { name: 'Casablanca', desc: 'Coastal metropolis' },
                            { name: 'Marrakech', desc: 'Red City magic' },
                            { name: 'Chefchaouen', desc: 'Blue Pearl' }
                        ].map((city) => (
                            <div
                                key={city.name}
                                onClick={() => navigate(`/chat?city=${city.name.toLowerCase()}`)}
                                className="group relative h-48 rounded-lg overflow-hidden cursor-pointer shadow-lg transform transition-all hover:scale-105"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-4 w-full">
                                    <h4 className="text-white font-bold text-lg">{city.name}</h4>
                                    <p className="text-amber-300 text-sm mt-1">{city.desc}</p>
                                    <div className="w-0 group-hover:w-full h-0.5 bg-amber-500 mt-2 transition-all duration-300"></div>
                                </div>
                            </div>
                        ))}
                        
                    </div>
                </div>
            </div>
        </div>
    );
}