// Menu data. price: number in OMR (3 decimals) or null = not announced yet.
// Nothing here is invented: names/looks come from @ihsancafe posts. Fill prices when the owner confirms.
window.MENU = {
  currency: "OMR",
  categories: [
    {
      id: "signature",
      title: "Signature drinks",
      note: "Names as shown on our Instagram. Prices are announced at opening.",
      photo: { src: "assets/img/drinks-trio.jpg", alt: "Three ihsan iced drinks on a wooden tray: matcha cloud, saffron mist, strawberry layer waves" },
      items: [
        { name: "saffron mist", desc: "Iced and swirled with saffron, finished with pistachio.", tag: "coming soon", price: null },
        { name: "matcha cloud", desc: "Layered matcha with a cloud of cream, pistachio and almond.", tag: "on the shortlist", price: null },
        { name: "strawberry layer waves", desc: "Strawberry layers under cream and fresh berry.", tag: "on the shortlist", price: null }
      ]
    },
    {
      id: "sweet",
      title: "Sweet",
      note: "Made to sit beside your cup.",
      photo: { src: "assets/img/saffron-pistachio.jpg", alt: "Saffron mist iced drink beside a slice of pistachio hush cake" },
      items: [
        { name: "pistachio hush", desc: "Pistachio cake, layered and generous.", tag: "coming soon", price: null }
      ]
    },
    {
      id: "coffee",
      title: "Coffee",
      note: "The full coffee list is shared when the doors open.",
      photo: { src: "assets/img/iced-pair.jpg", alt: "Two ihsan iced coffees in a car cup holder" },
      items: []
    }
  ]
};
