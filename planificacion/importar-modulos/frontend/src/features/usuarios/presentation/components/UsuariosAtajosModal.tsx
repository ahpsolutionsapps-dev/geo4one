import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Tab,
  TabGroup,
  TabList,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";

import { Button } from "@/components/ui";

interface ShortcutItem {
  keys: string;
  description: string;
}

interface ShortcutSection {
  title: string;
  items: ShortcutItem[];
}

const SHORTCUT_SECTIONS: ShortcutSection[] = [
  {
    title: "Listado",
    items: [
      { keys: "Ctrl+N", description: "Nuevo usuario" },
      { keys: "Ctrl+B", description: "Enfocar buscador" },
      { keys: "Ctrl+V", description: "Abrir opciones de vista" },
      { keys: "↑ / ↓", description: "Mover foco de fila" },
      {
        keys: "Enter",
        description: "Marcar o desmarcar checkbox de la fila activa",
      },
      {
        keys: "PageUp / PageDown",
        description: "Pagina anterior / siguiente",
      },
      {
        keys: "Alt+← / →",
        description: "Pagina anterior / siguiente",
      },
      { keys: "?", description: "Mostrar atajos disponibles" },
    ],
  },
  {
    title: "Formulario",
    items: [
      { keys: "Ctrl+G", description: "Guardar usuario" },
      {
        keys: "Ctrl+P",
        description: "Agregar o cambiar imagen",
      },
      { keys: "Enter", description: "Pasar al siguiente campo" },
      { keys: "?", description: "Mostrar atajos disponibles" },
    ],
  },
];

interface UsuariosAtajosModalProps {
  open: boolean;
  onClose: () => void;
  /** 0 = Listado, 1 = Formulario */
  initialTab?: number;
}

function ShortcutKeys({ keys }: { keys: string }) {
  const parts = keys.split("+");

  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {index > 0 ? (
            <span className="text-xs text-gray-400 dark:text-dark-300">+</span>
          ) : null}
          <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-gray-800 dark:border-dark-450 dark:bg-dark-600 dark:text-dark-50">
            {part}
          </kbd>
        </Fragment>
      ))}
    </span>
  );
}

function ShortcutList({ items }: { items: ShortcutItem[] }) {
  return (
    <ul className="divide-y divide-gray-100 dark:divide-dark-500">
      {items.map((item) => (
        <li
          key={`${item.keys}-${item.description}`}
          className="flex items-start justify-between gap-4 py-2.5"
        >
          <span className="text-sm text-gray-700 dark:text-dark-100">
            {item.description}
          </span>
          <ShortcutKeys keys={item.keys} />
        </li>
      ))}
    </ul>
  );
}

export function UsuariosAtajosModal({
  open,
  onClose,
  initialTab = 0,
}: UsuariosAtajosModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveTab(initialTab);
  }, [open, initialTab]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-120" onClose={() => undefined}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm dark:bg-black/40" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-dark-700">
                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-dark-50">
                  Atajos disponibles
                </DialogTitle>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Atajos del modulo de usuarios. Presiona{" "}
                  <ShortcutKeys keys="?" /> o Esc para cerrar.
                </p>

                <TabGroup
                  selectedIndex={activeTab}
                  onChange={setActiveTab}
                  className="mt-5"
                >
                  <TabList className="flex border-b border-gray-200 dark:border-dark-500">
                    {SHORTCUT_SECTIONS.map((section) => (
                      <Tab key={section.title} as={Fragment}>
                        {({ selected }) => (
                          <Button
                            unstyled
                            className={clsx(
                              "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap",
                              selected
                                ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
                                : "border-transparent text-gray-600 hover:text-gray-800 dark:text-dark-200 dark:hover:text-dark-50",
                            )}
                          >
                            {section.title}
                          </Button>
                        )}
                      </Tab>
                    ))}
                  </TabList>

                  <div className="custom-scrollbar mt-4 max-h-[min(50vh,24rem)] overflow-y-auto overflow-x-hidden pr-1">
                    <ShortcutList items={SHORTCUT_SECTIONS[activeTab].items} />
                  </div>
                </TabGroup>

                <div className="mt-6 flex justify-end">
                  <Button type="button" color="primary" onClick={onClose}>
                    Cerrar
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
