import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

/**
 * Windows and some routers refuse SRV queries used by mongodb+srv://
 * while nslookup still works. Use public DNS before MongoDB connects.
 */
const servers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1,8.8.4.4")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

dns.setServers(servers);
dns.setDefaultResultOrder("ipv4first");

export default dns;
