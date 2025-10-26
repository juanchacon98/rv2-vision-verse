const Footer = () => {
  return (
    <footer className="bg-foreground/5 py-8 border-t border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} RV2. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
