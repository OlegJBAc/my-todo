import React, { FC, useEffect, useState } from "react"
import s from './activeCreating.module.scss'
import { Field, Form, Formik } from "formik"
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks"
import { addTask, editTask } from "../../../redux/reducers/projects-slice"
import { addTaskToDefaultPage, editDefaultPageTask } from "../../../redux/reducers/defaultPages-slice"
import { constDefaultPages } from "../../../general/constants/constants"
import { v4 } from 'uuid'
import { taskPriorityType, taskType } from "../../../types/types"
import cnBind from 'classnames/bind'
import { getAppTheme } from "../../../redux/selectors"
import { useContextMenu } from "../../../hooks/useContextMenu"
import CreatingBottom from "./creatingBottom/creatingBottom"

const ActiveCreating: FC<propsType> = ({ project, setAddMode, editMode, setEditMode, task, pageElem }) => {
  
    const dispatch = useAppDispatch()
    const appTheme = useAppSelector(getAppTheme)
    const [ priorityForCreating, setPriorityForCreating ] = useState('none')
    const { localContextMenu, setLocalContextMenu, } = useContextMenu({  })

    const cx = cnBind.bind(s)

    useEffect(() => {
        if(localContextMenu){
            const checkClick = (e: any) => {
                let contextMenuElem = document.querySelector('.context__menu')
                const clickPathFirst = e.composedPath().includes(contextMenuElem)
                if( !clickPathFirst && localContextMenu ){
                    window.removeEventListener('click', checkClick)
                    setLocalContextMenu(false)
                } 
            }
            setTimeout(() => {
                window.addEventListener('click', checkClick)
            }, 0)
        }
    }, [localContextMenu])
    
    const submit = (values: valuesType, { setSubmitting }: submittingType) => {
        
        const defaultPages = constDefaultPages
        const getCreateTaskPayload = (projectName: string) => {
            return {
                projectName,
                task: {
                    id: editMode === task?.id && task ? task.id : v4(),
                    name: values.name,
                    description: values.description,
                    priority: priorityForCreating as taskPriorityType,
                    addedAt: new Date().toISOString(),
                    currentProject: projectName
                } 
            }
        }
        if(project !== 'completed'){
            if(!editMode){
                if(!defaultPages.includes(project)){
                    dispatch(addTask(getCreateTaskPayload(project)))
                }else{
                    // @ts-ignore
                    dispatch(addTaskToDefaultPage(getCreateTaskPayload(project)))
                }
                setAddMode(false)
            }else{
                if(!defaultPages.includes(project) && task){
                    dispatch(editTask(getCreateTaskPayload(task.currentProject)))
                    if(setEditMode){
                        setEditMode(task.id)
                    }
                }else{
                    if(task){
                        dispatch(editDefaultPageTask(getCreateTaskPayload(task.currentProject)))
                        if(setEditMode){
                            setEditMode(task.id)
                        }
                    }
                }
                if(setEditMode){
                    setEditMode('')
                }
                setAddMode(false)
            }
        }
    }
    const getCurrentPriority = (color: string) => {
        if(editMode && task.priority === color){
            return true
        }if(editMode && priorityForCreating === color){
            return true
        }
        return false
    }
    return (
        <div className={cx('create', {
            light: appTheme === 'Light',
            dark: appTheme === 'Dark',
            priority__red: getCurrentPriority('red'),
            priority__orange: getCurrentPriority('orange'),
            priority__purple: getCurrentPriority('purple'),
            priority__none: getCurrentPriority('none'),
        })}>
            <Formik initialValues={{ name: editMode === task?.id && task ? task.name : '', 
                                     description: editMode === task?.id && task ? task.description : '' }} 
                    onSubmit={submit}>
                <Form className={cx('forms', {
                        light: appTheme === 'Light',
                        dark: appTheme === 'Dark',
                    })}>
                    <Field name='name' placeholder='Enter task name...'/>
                    <Field name='description' placeholder='Enter task description'/>
                    <CreatingBottom setPriorityForCreating={setPriorityForCreating} 
                                    editMode={editMode}
                                    setEditMode={setEditMode}
                                    task={task}
                                    project={project}
                                    setAddMode={setAddMode}
                                    pageElem={pageElem}
                                />
                </Form>
            </Formik>
        </div>
    )
}

export default ActiveCreating


interface propsType {
    project: string
    setAddMode: (addMode: boolean) => void
    setEditMode?: (editMode: string) => void
    editMode?: string
    task: taskType
    pageElem: React.RefObject<HTMLDivElement>
}
interface valuesType {
    name: string
    description: string
}
interface submittingType {
    setSubmitting: (isSubmitted: boolean) => any
}

