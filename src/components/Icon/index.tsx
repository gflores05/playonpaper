import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

const iconsMap: { [key: string]: IconDefinition } = {
  copy: faCopy
}

interface IconProps {
  name: keyof typeof iconsMap
}

export function Icon({ name }: IconProps) {
  return <FontAwesomeIcon icon={iconsMap[name]} />
}
