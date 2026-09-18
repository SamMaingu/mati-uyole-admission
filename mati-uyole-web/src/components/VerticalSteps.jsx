import { Link } from 'react-router-dom'
import {
  Check,
  ArrowRight,
  User,
  FileText,
  Users,
  GraduationCap,
  CreditCard,
  BookOpen,
  ClipboardCheck,
} from 'lucide-react'
import { stepLabel } from '../lib/steps'

const STEP_ICONS = {
  account: User,
  personal: FileText,
  kin: Users,
  academic: GraduationCap,
  payment: CreditCard,
  programme: BookOpen,
  review: ClipboardCheck,
}

function StepRow({ step, number, current }) {
  const Icon = STEP_ICONS[step.key]
  const iconSize = 16
  const showArrow = current ? step.key === current : step.state === 'active'

  if (step.state === 'locked') {
    return (
      <div className={`vstep locked ${showArrow ? 'current' : ''}`}>
        <span className="rail">
          <span className="vdot">
            <Icon size={iconSize} strokeWidth={1.75} />
          </span>
        </span>
        <span className="vlabel">
          <span>
            {number && <span className="vnum">{number}.</span>}
            {stepLabel(step.key)}
          </span>
          {step.sub && <small>{step.sub}</small>}
        </span>
        {showArrow && <ArrowRight size={17} strokeWidth={1.75} className="varr" />}
      </div>
    )
  }

  return (
    <Link to={step.to} className={`vstep ${step.state} ${showArrow ? 'current' : ''}`}>
      <span className="rail">
        <span className="vdot">
          {step.state === 'done' ? (
            <Check size={15} strokeWidth={2.5} />
          ) : (
            <Icon size={iconSize} strokeWidth={1.75} />
          )}
        </span>
      </span>
      <span className="vlabel">
        <span>
          {number && <span className="vnum">{number}.</span>}
          {stepLabel(step.key)}
        </span>
        {step.sub && <small>{step.sub}</small>}
      </span>
      {showArrow && <ArrowRight size={17} strokeWidth={1.75} className="varr" />}
    </Link>
  )
}

export default function VerticalSteps({ steps, current }) {
  const numbers = Object.fromEntries(
    steps
      .filter((s) => s.key !== 'account')
      .map((s, i) => [s.key, i + 1]),
  )
  return (
    <div className="vsteps">
      {steps.map((step) => (
        <StepRow key={step.key} step={step} number={numbers[step.key] ?? null} current={current} />
      ))}
    </div>
  )
}