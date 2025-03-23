import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './DefaultIcon'

const cities = [
  { name: "Marrakech", location: [31.6315, -8.0083], description: "Famous for its vibrant markets and historic medina" },
  { name: "Casablanca", location: [33.5731, -7.5898], description: "Morocco's largest city with modern architecture" },
  { name: "Fes", location: [34.0181, -5.0078], description: "Known for its ancient walled medina and tanneries" },
  { name: "Chefchaouen", location: [35.1689, -5.2694], description: "The blue city nestled in the Rif Mountains" }
];
const center = [31.6315, -8.0083]

export default function Map() {
  return (
    <div>
      <MapContainer center={center} zoom={5} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {cities.map((city, index) => (
          <Marker key={index} position={city.location}>
            <Popup>
              <div>
                <h3 className='text-bold text-lg'>{city.name}</h3>
                <p>{city.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}