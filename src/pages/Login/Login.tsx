import { yupResolver } from '@hookform/resolvers/yup'
import React, { useContext } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import Input from 'src/components/Input'
import { LoginSchema, loginSchema, getRules, schema } from 'src/utils/rule'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import { User } from 'src/types/user.type'
import { profile } from 'console'

// interface FormData {
//   email: string
//   password: string
// }
type FormData = LoginSchema

export default function Login() {
  const { setIsAuthenticated, profile, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    setError,
    watch,
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  // not pass rule when use yup
  // const rules = getRules(getValues)
  const loginAccountMutation = useMutation({
    mutationFn: (body: LoginSchema) => authApi.login(body)
  })

  const onSubmit = handleSubmit((data) => {
    console.log('error', errors)

    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        const updateProfile: User = {
          id: data.data.id,
          username: data.data.username,
          roles: data.data.roles
        }
        if (data.data.roles.includes('ROLE_Shop')) {
          updateProfile.shopId = data.data.shopId
        }

        // console.log('success login', data)
        toast.success('Login success')
        setIsAuthenticated(true)
        setProfile(updateProfile)
        navigate('/')
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError<ErrorResponse<LoginSchema>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof LoginSchema, {
                message: formError[key as keyof LoginSchema],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  // const val = watch()
  // console.log(val)
  console.log('aft set', profile)
  return (
    <div className='bg-orange'>
      {/* <Helmet>
        <title>Đăng nhập | Shopee Clone</title>
        <meta name='description' content='Đăng nhập vào dự án Shopee Clone' />
      </Helmet> */}
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl mb-4 '>Đăng nhập</div>
              <Input
                name='username'
                register={register}
                type='username'
                errorMessage={errors.username?.message}
                placeholder='Username'
                // rule={rules.email}
              />
              <Input
                name='password'
                register={register}
                type='password'
                // classNameEye='absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]'
                errorMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='on'
                // rule={rules.password}
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex  w-full items-center justify-center bg-red-500 py-4 px-2 text-sm uppercase text-white hover:bg-red-600'
                  isLoading={loginAccountMutation.isPending}
                  disabled={loginAccountMutation.isPending}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                <Link className='ml-1 text-red-400' to='/register'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
