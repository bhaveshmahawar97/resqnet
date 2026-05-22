export const TYPE_COLORS = {
  Rescue:  { bg: "rgba(22,160,86,0.10)",  text: "#16A056" },
  Medical: { bg: "rgba(59,130,246,0.10)", text: "#3B82F6" },
  Rehab:   { bg: "rgba(245,158,11,0.10)", text: "#D97706" },
  Shelter: { bg: "rgba(139,92,246,0.10)", text: "#7C3AED" },
};

export const ALL_STATUS = ["All", "Verified", "Unverified"];

export const NETWORK_NODES = [
  { name: "Mumbai",    x: "22%", y: "62%", count: 28, size: "lg" },
  { name: "Delhi",     x: "42%", y: "24%", count: 34, size: "lg" },
  { name: "Bengaluru", x: "34%", y: "76%", count: 21, size: "md" },
  { name: "Hyderabad", x: "40%", y: "64%", count: 18, size: "md" },
  { name: "Chennai",   x: "43%", y: "82%", count: 15, size: "md" },
  { name: "Kolkata",   x: "66%", y: "44%", count: 12, size: "sm" },
  { name: "Pune",      x: "26%", y: "67%", count: 9,  size: "sm" },
  { name: "Jaipur",    x: "38%", y: "36%", count: 8,  size: "sm" },
  { name: "Chandigarh",x: "42%", y: "16%", count: 6,  size: "sm" },
  { name: "Kochi",     x: "30%", y: "88%", count: 7,  size: "sm" },
];

export const TESTIMONIALS = [
  { name: "Priya Menon",     role: "Director, Paws of Hope",         quote: "ResQNet cut our average response time from 40 minutes to 18. The AI dispatch is a genuine lifesaver — literally.", city: "Mumbai" },
  { name: "Arjun Khanna",    role: "Founder, Urban Canine Coalition", quote: "The adoption pipeline alone has tripled our placements. We reach adopters we'd never have found on our own.",  city: "Delhi" },
  { name: "Sneha Rao",       role: "Head of Care, Wildlife Bridge",   quote: "Finally, a platform built by people who actually understand what field rescuers need. Nothing else comes close.",   city: "Pune" },
];
