import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Menu, X } from "../icons";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: React.PropsWithChildren<{
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}>) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: React.PropsWithChildren<{
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}>) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col w-[280px] flex-shrink-0 relative",
        className
      )}
      style={{ 
        ...style,
        backgroundColor: '#ffffff', 
        background: '#ffffff', 
        backgroundImage: 'none',
        backgroundSize: 'auto',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0% 0%',
        opacity: 1, 
        backdropFilter: 'none', 
        WebkitBackdropFilter: 'none', 
        filter: 'none', 
        WebkitFilter: 'none'
      }}
      initial={{ 
        opacity: 1, 
        backgroundColor: '#ffffff', 
        background: '#ffffff',
        backgroundImage: 'none',
        filter: 'none',
        backdropFilter: 'none'
      }}
      animate={{
        width: animate ? (open ? "280px" : "70px") : "280px",
        backgroundColor: '#ffffff',
        background: '#ffffff',
        backgroundImage: 'none',
        filter: 'none',
        backdropFilter: 'none',
        opacity: 1,
      }}
      transition={{ opacity: { duration: 0 }, backgroundColor: { duration: 0 } }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {/* Menu icon button - visible when collapsed */}
      <AnimatePresence>
        {animate && !open && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Expand menu"
          >
            <Menu className="h-6 w-6 text-foreground" style={{ color: '#000000' }} />
          </motion.button>
        )}
      </AnimatePresence>
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-14 px-4 py-3 flex flex-row md:hidden items-center justify-between bg-white w-full border-b border-border shadow-sm"
        )}
        {...props}
      >
        <div className="flex items-center justify-between z-20 w-full">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex-shrink-0 hidden" />
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 touch-manipulation ml-auto"
            aria-label="Toggle menu"
            style={{ minHeight: '48px', minWidth: '48px' }}
          >
            <Menu className="text-foreground cursor-pointer h-6 w-6" />
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-[99]"
                onClick={() => setOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className={cn(
                  "fixed h-full w-[85%] max-w-sm inset-y-0 left-0 bg-white shadow-2xl z-[100] flex flex-col overflow-hidden",
                  className
                )}
                style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none', filter: 'none', WebkitFilter: 'none', backgroundColor: '#ffffff', background: '#ffffff', opacity: 1 }}
              >
                <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-white">
                  <div className="h-8 w-8 rounded-lg bg-primary flex-shrink-0" />
                  <button
                    className="p-3 sm:p-2 rounded-lg hover:bg-muted/50 transition-colors touch-manipulation"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    style={{ minHeight: '48px', minWidth: '48px' }}
                  >
                    <X className="h-6 w-6 text-foreground" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  {children}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  [key: string]: any;
}) => {
  const { open, animate } = useSidebar();
  
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center group/sidebar rounded-xl transition-all duration-200 hover:bg-gray-100 active:bg-gray-200 touch-manipulation",
        "md:rounded-lg",
        animate && !open 
          ? "justify-center py-2 px-2 md:py-2 md:px-2" 
          : "justify-start gap-3 py-3 px-4 md:py-2 md:px-3",
        className
      )}
      style={{ color: '#000000', backgroundColor: 'transparent' }}
      {...props}
    >
      {/* Icon - always visible */}
      <div 
        className="flex-shrink-0 text-foreground" 
        style={{ color: '#000000', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {link.icon}
      </div>
      
      {/* Label - only visible when open */}
      {(animate ? open : true) && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{
            opacity: open ? 1 : 0,
            width: open ? "auto" : 0,
          }}
          transition={{ duration: 0.2 }}
          className="text-base md:text-lg font-light tracking-tight whitespace-nowrap overflow-hidden"
          style={{ color: '#000000' }}
        >
          {link.label}
        </motion.span>
      )}
    </a>
  );
};
