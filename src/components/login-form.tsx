import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {supabase} from "@/lib/supabase-client.ts";
import * as React from "react";
import {zodResolver} from "@hookform/resolvers/zod"
import {
  useForm,
} from "react-hook-form"
import {z} from "zod"
import {useNavigate} from "react-router-dom";
import {Spinner} from "@/components/ui/spinner.tsx";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  })
})

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    const response = await supabase.auth.signInWithPassword(values)

    if (response.error) {
      alert(response.error.message)
    }

    setLoading(false)
    if (!response.error) {
      navigate("/");
    }
  }

  return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Login to your bus.stop account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name={"email"}
                    render={({field}) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                                placeholder="v.n@hpc.at"
                                {...field}
                            />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={"password"}
                    render={({field}) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                                {...field}
                                type="password"
                            />
                          </FormControl>
                          <FormDescription><a
                              href="#"
                              className="ml-auto text-sm underline-offset-2 hover:underline"
                          >
                            Forgot your password?
                          </a>
                          </FormDescription>
                          <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit">{loading ?
                    <Spinner></Spinner> : <></>} Login</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <p
            data-slot="field-description"
            className="text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance
                last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5
                [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4 px-6 text-center"
        >
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </p>
      </div>
  )
}
