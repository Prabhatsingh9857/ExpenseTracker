import dns from "dns";

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

dns.resolveSrv(
  "_mongodb._tcp.cluster0.flis9cy.mongodb.net",
  (err, addresses) => {
    console.log(err || addresses);
  }
);