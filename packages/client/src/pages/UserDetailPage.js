import React, { useState, useEffect } from 'react'
import {
  Container,
  Card,
  Form,
  Button,
  Collapse,
  Figure
} from 'react-bootstrap'
import { LoadingSpinner, Post } from 'components'
import { useProvideAuth } from 'hooks/useAuth'
import { useRequireAuth } from 'hooks/useRequireAuth'
import axios from 'utils/axiosConfig.js'
import AvatarPicker from "components/Avatarpick"
import {toast} from "react-toastify"


export default function UserDetailPage({
  match: {
    params: { uid },
  },
  history
}) {
  const { state } = useProvideAuth()
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const [validated, setValidated] = useState(false)
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({
    password: '',
    currentPassword: "",
    confirmPassword: "",
    isSubmitting: false,
    errorMessage: null,
    profileAvatar: ""
  })

  const {
    state: { isAuthenticated,},
  } = useRequireAuth()

  useEffect(() => {
    const getUser = async () => {
      try {
        const userResponse = await axios.get(`users/${uid}`)
        setUser(userResponse.data)
        setLoading(false)
      } catch (err) {
        console.error(err.message)
      }
    }
    isAuthenticated && getUser()
  }, [uid, isAuthenticated])

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    })
  }

  const handleAvatarChange = (pic) => {
    setData({
      ...data,
     profileAvatar: pic
    })
  }

  const handleUpdatePassword = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    const form = event.currentTarget
    // handle invalid or empty form
    if (form.checkValidity() === false) {
      setValidated(true)
      return
    }
    
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    })

    if (data.password !== data.confirmPassword){
      setData({
        ...data,
        isSubmitting:false
      })
      return toast.warning("Your new passwords do not match")
    }
    try {
      // write code to call edit user endpoint 'users/:id'
      const {
        user: { uid, username },
      } = state
      let res = await axios.put(`users/${uid}`,{password:data.password})
      console.log(data.password, uid, username)
      setValidated(false)

      const response = await axios.put(`users/${uid}`, {password:data.password, profileImage: data.profileAvatar, currentPassword:data.currentPassword})
      setData({
        ...data,
        isSubmitting:false  
      })
      toast.success("Your PASSWORD and AVATAR have been changed!")

      // don't forget to update loading state and alert success
    } catch (error) {
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: error.message,
      })
      console.log(JSON.stringify(error))
    }
  }

  if (!isAuthenticated) {
    return <LoadingSpinner full />
  }

  if (loading) {
    return <LoadingSpinner full />
  }

  return (
    <>
    <Container className='clearfix'>
      <Button variant='outline-info' onClick={()=>{history.goBack()}}
        style={{border:'none', color: '#E5E1DF'}}
        className="mt-3 mb-3"
        >
        Go Back
      </Button>
      <Card bg='header' className='text-center'>
        <Card.Body>
          <Figure
            className='bg-border-color rounded-circle overflow-hidden my-auto ml-2 p-1'
            style={{
              height: '50px',
              width: '50px',
              backgroundColor: 'white',
            }}
          >
            <Figure.Image
              src={user.profile_image}
              className='w-100 h-100'
            />
          </Figure>
          <Card.Title>{uid}</Card.Title>
          <Card.Title>{user.email}</Card.Title>
          {state.user.username === uid && (
            <div>
              <div onClick={() => setOpen(!open)} style={{cursor: 'pointer', color: '#BFBFBF'}}>Edit Profile</div>
            </div>
          )}
          { open && (
            <Container animation="false">
              <div className='row justify-content-center p-4'>
                <div className='col text-center'>
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleUpdatePassword}
                  >
                    <Form.Group>
                      <Form.Label htmlFor='currentPassword'>Current Password</Form.Label>
                      <Form.Control
                        type='password'
                        name='currentPassword'
                        required
                        value={data.currentPassword}
                        onChange={handleInputChange}
                      />
                      <Form.Label htmlFor='password'>New Password</Form.Label>
                      <Form.Control
                        type='password'
                        name='password'
                        required
                        value={data.password}
                        onChange={handleInputChange}
                      /><Form.Label htmlFor='password'>Confirm New Password</Form.Label>
                      <Form.Control
                        type='password'
                        name='confirmPassword'
                        required
                        value={data.confirmPassword}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type='invalid'>
                        New Password is required
                      </Form.Control.Feedback>
                      <Form.Text id='passwordHelpBlock' muted>
                        Must be 8-20 characters long.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Choose New Avatar</Form.Label>
                      <AvatarPicker firetruck={handleAvatarChange} profileImage={data.profileAvatar}/>
                    </Form.Group>
                    {data.errorMessage && (
                      <span className='form-error'>{data.errorMessage}</span>
                    )}
                    <Button type='submit' disabled={data.isSubmitting}>
                      {data.isSubmitting ? <LoadingSpinner /> : 'Update'}
                    </Button>
                  </Form>
                </div>
              </div>
            </Container>
          )}
        </Card.Body>
      </Card>
    </Container>
    <Container
      className='pt-3 pb-3'
    >
      {user.posts.length !== 0 ? (
        user.posts.map((post) => <Post key={post._id} post={post} userDetail/>)
      ) : (
        <div
          style={{
            marginTop: '75px',
            textAlign: 'center',
          }}
        >
          No User Posts
        </div>
      )}
    </Container>
    </>
  )
}
