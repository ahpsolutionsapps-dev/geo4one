import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";

import { Button } from "@/components/ui";

import { UploadedExcelFile } from "../data/provincias.api";

interface ProvinciasExcelImportModalProps {
  result: UploadedExcelFile | null;
  onClose: () => void;
}

export function ProvinciasExcelImportModal({
  result,
  onClose,
}: ProvinciasExcelImportModalProps) {
  return (
    <Transition appear show={Boolean(result)} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={onClose}>
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
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="size-6 text-success" />
                      <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-dark-50">
                        Precarga completada
                      </Dialog.Title>
                    </div>
                    <p className="mt-2 break-all text-sm text-gray-500 dark:text-dark-300">
                      {result?.originalFileName}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-dark-600 dark:hover:text-dark-100"
                    onClick={onClose}
                    aria-label="Cerrar detalles de precarga"
                  >
                    <XMarkIcon className="size-5" />
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-dark-500">
                    <p className="text-sm text-gray-500 dark:text-dark-300">
                      Provincias nuevas
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-dark-50">
                      {result?.importedCount ?? 0}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-dark-500">
                    <p className="text-sm text-gray-500 dark:text-dark-300">
                      Provincias omitidas
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-dark-50">
                      {result?.skippedCount ?? 0}
                    </p>
                  </div>
                </div>

                {(result?.duplicates.length ?? 0) > 0 && (
                  <section className="mt-5">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-dark-100">
                      Ya existían y no se volvieron a cargar
                    </h3>
                    <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-dark-600 dark:text-dark-100">
                      {result?.duplicates.map((provincia, index) => (
                        <li key={`${provincia}-${index}`}>{provincia}</li>
                      ))}
                    </ul>
                  </section>
                )}

                <div className="mt-6 flex justify-end">
                  <Button type="button" onClick={onClose}>
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
