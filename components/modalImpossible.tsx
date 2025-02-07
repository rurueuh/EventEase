"use client";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

/**
 * @description create a simple modal for say this is not a real website
 * @example use this for param const { isOpen, onOpen, onOpenChange } = useDisclosure();
 * @example <Button color="danger" variant="shadow" onPress={onOpen}>
              text
              <ModalImpossibleNotRealSite isOpen={isOpen} onOpenChange={onOpenChange} />
            </Button>
 * @param isOpen
 * @param onOpenChange
 * @returns JSX.Element
 */
export default function ModalImpossibleNotRealSite(
  {
    isOpen,
    onOpenChange,
    customText
  }: Readonly<{
    isOpen: boolean,
    onOpenChange: () => void
    customText?: string
  }>
): JSX.Element {

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Action impossible</ModalHeader>
            <ModalBody>
              <p>
                {customText ? customText : "cette action n'est pas possible car le site web n'est pas un vrai site web merci de contacter ruru par email ou discord: maxjulien666@gmail.com ou rurueuh sur discord"}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}