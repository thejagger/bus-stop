import React from "react";
import {
  CommandDialog,
  CommandEmpty, CommandGroup,
  CommandInput, CommandItem,
  CommandList
} from "@/components/ui/command.tsx";
import type {NavItem} from "@/config/navigation.ts";
import {useTranslation} from "react-i18next";
import {ArrowRight} from "lucide-react";
import {useNavigate} from "react-router-dom";

export function QuickMenuDialog({items}: { items: NavItem[] }) {
  const navigate = useNavigate();
  const {t} = useTranslation('navigation');
  const [open, setOpen] = React.useState(false)
  const delta = 500;
  let lastShiftPressTime = 0;

  React.useEffect(() => {
    const up = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        const curShiftPressTime = Date.now();

        if (curShiftPressTime - lastShiftPressTime <= delta) {
          e.preventDefault()
          setOpen((open) => !open)
        }

        lastShiftPressTime = curShiftPressTime
      }
    }
    document.addEventListener("keyup", up)
    return () => document.removeEventListener("keyup", up)
  }, [])

  return (
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..."/>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading={t('quick_menu_heading')}>
            {items.map((item) => {
              if (item.items) {
                return <>
                  {item.items.map((subItem) => <CommandItem
                          key={subItem.path}
                          keywords={[t(item.path)]}
                          onSelect={() => {
                            setOpen(false)
                            navigate(`/${item.path}/${subItem.path}`)
                          }
                          }>
                        <ArrowRight/>
                        <span>{t(subItem.path)}</span>
                      </CommandItem>
                  )}
                </>
              } else {
                return <CommandItem onSelect={() => {
                  setOpen(false)
                  navigate(`/${item.path}`)
                }}>
                  <ArrowRight/>
                  <span>{t(item.path)}</span>
                </CommandItem>
              }
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
  )
}