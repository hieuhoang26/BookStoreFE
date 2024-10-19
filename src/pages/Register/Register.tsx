import { yupResolver } from '@hookform/resolvers/yup'
import { log } from 'console'
import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'
import { getRules } from 'src/utils/rule'
import { schema, Schema } from 'src/utils/rule'
// Không có tính năng tree-shaking
// import { omit } from 'lodash'
// Import chỉ mỗi function omit
import omit from 'lodash/omit'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'

// interface FormData {
//   email: string
//   password: string
//   confirm_password: string
// }
// interface
type FormData = Pick<Schema, 'username' | 'email' | 'password' | 'confirm_password' | 'phoneNumber'> // or use omit
// const registerSchema = schema.pick(['email', 'password', 'confirm_password']) // get some field from schema
const registerSchema = schema

export default function Register() {
  // const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    setError,
    watch,
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })
  // not pass rule when use yup
  // const rules = getRules(getValues)

  const registerAccountMutation = useMutation({
    mutationKey: ['registerAccount'],
    // mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
    mutationFn: async (body: Omit<FormData, 'confirm_password'>) => {
      console.log('Mutation function called')
      const response = await authApi.registerAccount(body)
      console.log('API Response:', response)
      return response
    }
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data)

    const body = omit(data, ['confirm_password'])

    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        console.log(data)
        // setIsAuthenticated(true)
        // setProfile(data.data.data.user)
        navigate('/login')
      },
      onError: (error) => {
        console.log(error)
        // get error from axios set to error of react hook form -> show error
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            if (formError?.email) {
              setError('email', {
                message: formError.email,
                type: 'Server'
              })
            }
            if (formError?.password) {
              setError('password', {
                message: formError.password,
                type: 'Server'
              })
            }
            // Object.keys(formError).forEach((key) => {
            //   setError(key as keyof Omit<FormData, 'confirm_password'>, {
            //     message: formError[key as keyof Omit<FormData, 'confirm_password'>],
            //     type: 'Server'
            //   })
            // })
          }
        }
      }
    })
  })
  // const val = watch()
  // console.log(val)
  return (
    <div className='bg-orange'>
      {/* <Helmet>
        <title>Đăng ký | Shopee Clone</title>
        <meta name='description' content='Đăng ký tài khoản vào dự án Shopee Clone' />
      </Helmet> */}
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input
                name='username'
                register={register}
                type='username'
                className='mt-8'
                errorMessage={errors.username?.message}
                placeholder='UseName'
                // rule={rules.email}
              />
              <Input
                name='email'
                register={register}
                type='email'
                errorMessage={errors.email?.message}
                placeholder='Email'
                // rule={rules.email}
              />
              <Input
                name='phoneNumber'
                register={register}
                type='phoneNumber'
                errorMessage={errors.phoneNumber?.message}
                placeholder='phoneNumber'
                // rule={rules.email}
              />
              <Input
                name='password'
                register={register}
                type='password'
                className='mt-1'
                // classNameEye='absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]'
                errorMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='on'
                // rule={rules.password}
              />

              <Input
                name='confirm_password'
                register={register}
                type='password'
                className='mt-1'
                // classNameEye='absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]'
                errorMessage={errors.confirm_password?.message}
                placeholder='Confirm Password'
                autoComplete='on'
              />

              <div className='mt-2'>
                <Button
                  className='flex w-full items-center justify-center bg-red-500 py-4 px-2 text-sm uppercase text-white hover:bg-red-600'
                  isLoading={registerAccountMutation.isPending}
                  disabled={registerAccountMutation.isPending}
                >
                  Đăng ký
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='ml-1 text-red-400' to='/login'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
