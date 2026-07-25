const WHATSAPP_NUMBER = "50587328420";
const WHATSAPP_MESSAGE =
	"Hola, encontré su sitio web y me gustaría más información sobre sus servicios.";

export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
