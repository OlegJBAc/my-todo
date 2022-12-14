import React, { FC } from "react"
import { constDefaultPages } from "../../../../../../../../general/constants/constants"
import { engText } from "../../../../../../../../general/textData/eng"
import { ruText } from "../../../../../../../../general/textData/ru"
import { useAppDispatch, useAppSelector } from "../../../../../../../../hooks/hooks"
import { setPriorityDefaultPageTask } from "../../../../../../../../redux/reducers/defaultPages-slice"
import { setPriorityTask } from "../../../../../../../../redux/reducers/projects-slice"
import { getAppLanguage } from "../../../../../../../../redux/selectors"
import { taskPriorityType, taskType } from "../../../../../../../../types/types"
import s from './setPriority.module.scss'


const SetPriority: FC<propsType> = ({ projectName, task, isCreating=false, setPriorityForCreating,
                                      setLocalContextMenu }) => {
    const dispatch = useAppDispatch()

    const appLanguage = useAppSelector(getAppLanguage)

    const setPriorityFunc = (priority: taskPriorityType) => () => {
        if(!isCreating){
            if(!constDefaultPages.includes(projectName)){
                dispatch(setPriorityTask({ projectName, task: {...task, priority} }))
            }else{
                dispatch(setPriorityDefaultPageTask({ projectName, task: {...task, priority} }))
            }
        }else{
            if(setPriorityForCreating){
                setPriorityForCreating(priority)
                if(setLocalContextMenu){
                    setLocalContextMenu(false)
                }
            }
        }
    }

    return (
        <div className={s.priority}>
            <h3>
                {appLanguage === 'Eng' ? engText.contextMenu.setPriorityHeader : ruText.contextMenu.setPriorityHeader}
            </h3>
            <ul className={s.select}>
                <li className={s.select__red} onClick={setPriorityFunc('red')}></li>
                <li className={s.select__orange} onClick={setPriorityFunc('orange')}></li>
                <li className={s.select__purple} onClick={setPriorityFunc('purple')}></li>
                <li className={s.select__none} onClick={setPriorityFunc('none')}></li>
            </ul>
        </div>
    )
}

export default SetPriority


interface propsType {
    projectName: string
    task: taskType
    isCreating?: boolean
    setPriorityForCreating?: (priorityForCreating: string) => void
    setLocalContextMenu?: (localContextMenu: boolean) => void
}