import { useEffect, useRef } from "react";
import L from "leaflet";

export default function MapPicker({ loc, onPick }) {
  const el = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const cb = useRef(onPick);
  cb.current = onPick;

  useEffect(() => {
    map.current = L.map(el.current, { zoomControl: true }).setView(
      [loc.lat, loc.lon],
      7,
    );
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map.current);
    marker.current = L.circleMarker([loc.lat, loc.lon], {
      radius: 9,
      color: "#f2b134",
      weight: 3,
      fillColor: "#f2b134",
      fillOpacity: 0.35,
    }).addTo(map.current);
    map.current.on("click", (e) => cb.current(e.latlng.lat, e.latlng.lng));
    return () => map.current.remove();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!map.current) return;
    marker.current.setLatLng([loc.lat, loc.lon]);
    map.current.flyTo([loc.lat, loc.lon], Math.max(map.current.getZoom(), 7), {
      duration: 0.8,
    });
  }, [loc.lat, loc.lon]);

  return <div ref={el} className="h-80 w-full lg:h-full min-h-80" />;
}
