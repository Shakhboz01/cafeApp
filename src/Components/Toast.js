import { useToast,Button } from '@chakra-ui/react'


export default function ToastExample({object}) {

    const toast = useToast()
    return (
      <Button
        onClick={() =>
          toast({
            title: "object.title",
            description: "object.description",
            status: "success",
            duration: 9000,
            isClosable: true,
          })
        }
      >
        Show Toast
      </Button>
    )
  }